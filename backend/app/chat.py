"""Builds the grounded prompt and streams answers from Groq."""
import json
from collections.abc import Iterator

from app import config, rag, user_rag

BASE_SYSTEM = """You are the personal AI assistant for {name}, embedded on {name}'s portfolio website. Your job is to help visitors \u2014 especially recruiters and hiring managers \u2014 learn about {name}.

STRICT RULES:
1. Answer ONLY using the information in the CONTEXT below. The context comes from {name}'s own verified profile documents.
2. If the answer is not in the context, clearly say you don't have that information, then point to what you CAN help with (projects, skills, experience, education). Never guess or invent facts, dates, employers, numbers, or links.
3. Talk about {name} in the third person, in a warm, confident, professional tone. Be **clear and scannable** — not a wall of text. Default length: about **120–180 words** for straightforward questions, up to **~250 words** for project or experience deep-dives. Use 2 short paragraphs plus a small bullet list (max 5 bullets) when listing skills, roles, or stack. Bold only key phrases — not every technology. Be substantive: enough detail to feel complete, never telegraphic or padded.
4. Answer **directly in the chat** — give the facts inline. Never tell the visitor to "see the About section", "check Projects", "visit a tab", or navigate elsewhere. There is no separate About page; you ARE the interface. Do not reference document filenames unless listing sources is natural.
5. Include real links only if they appear in the context.
6. Reply in the same language the visitor writes in.
"""

MODE_PROMPTS = {
    "portfolio": "MODE: Portfolio. Friendly overview — background, strengths, standout projects. Give enough context to be genuinely informative; stay readable, not rushed.",
    "recruiter": "MODE: Recruiter. Hiring-manager briefing: fit, top evidence, stack headline, why interview. Balanced length — complete enough to decide next steps, no filler.",
    "job_match": (
        "MODE: Role Fit. The visitor may paste a job description. Compare it against {name}'s profile "
        "and give clearly labeled sections: **Strong matches**, **Partial matches**, **Honest gaps**, "
        "and a short **Overall verdict** (Strong fit / Possible fit / Weak fit)."
    ),
}

ASSISTANT_SYSTEM = (
    "You are a helpful, friendly AI assistant. Answer clearly and concisely, "
    "using Markdown formatting (short paragraphs, **bold**, and bullet points where "
    "useful). Reply in the same language the user writes in."
)

ASSISTANT_RAG_ADDON = (
    "\n\nThe user has uploaded personal documents. When relevant, use the CONTEXT "
    "below from those files. If the answer is not in the context, answer from general "
    "knowledge and say when you are not using their uploads."
)

STYLE_PROMPTS = {
    "study": (
        "RESPONSE TONE: Study Notes. Format like revision notes — headings, defined terms, "
        "bullet points, and a one-line takeaway at the end."
    ),
    "technical": (
        "RESPONSE TONE: Engineer Mode. Go deep — architecture, trade-offs, edge cases. "
        "Assume the reader is technical."
    ),
    "plain": (
        "RESPONSE TONE: Plain English. Neutral, professional, easy to read. "
        "Use clear short paragraphs and bullets when they help. "
        "Give enough detail to be genuinely useful — not telegraphic, not an essay."
    ),
    "pitch": (
        "RESPONSE TONE: Elevator Pitch. Confident, tight, impact-focused. Lead with the "
        "strongest point; use STAR when telling stories."
    ),
    "build": (
        "RESPONSE TONE: Show Me Code. Start with a working code snippet, then explain briefly. "
        "Prefer copy-paste-ready examples."
    ),
}


def apply_style(system_prompt: str, style: str | None) -> str:
    if style and style in STYLE_PROMPTS:
        return system_prompt + "\n\n" + STYLE_PROMPTS[style]
    return system_prompt


def build_system_prompt(mode: str, context: str) -> str:
    name = config.PERSON_NAME
    mode_text = MODE_PROMPTS.get(mode, MODE_PROMPTS["portfolio"]).format(name=name)
    return (
        BASE_SYSTEM.format(name=name)
        + "\n"
        + mode_text
        + "\n\nCONTEXT:\n"
        + context
    )


def _last_user_message(messages: list[dict]) -> str:
    for msg in reversed(messages):
        if msg.get("role") == "user":
            return msg.get("content", "")
    return ""


def _format_sources(hits: list[dict]) -> list[dict]:
    """Deduplicate retrieval hits into a compact source list for the UI."""
    seen: set[tuple[str, str]] = set()
    sources: list[dict] = []
    for hit in hits:
        source = hit.get("source", "unknown")
        heading = hit.get("heading") or ""
        key = (source, heading)
        if key in seen:
            continue
        seen.add(key)
        sources.append(
            {
                "source": source,
                "heading": heading,
                "score": round(float(hit.get("score", 0)), 3),
            }
        )
    return sources


def prepare_chat(
    messages: list[dict],
    mode: str = "portfolio",
    *,
    user_id: str | None = None,
    temperature: float = 0.7,
    style: str | None = "plain",
) -> dict:
    """Retrieve context and build the system prompt. Returns sources for the UI."""
    temp = max(0.0, min(1.0, temperature))
    sources: list[dict] = []

    if mode == "assistant":
        system_prompt = ASSISTANT_SYSTEM
        if user_id:
            query = _last_user_message(messages)
            hits = user_rag.search_user(user_id, query)
            sources = _format_sources(hits)
            if hits:
                context = "\n\n---\n\n".join(h["text"] for h in hits)
                system_prompt += ASSISTANT_RAG_ADDON + "\n\nCONTEXT:\n" + context
    else:
        query = _last_user_message(messages)
        hits = rag.search(query)
        sources = _format_sources(hits)
        context = "\n\n---\n\n".join(h["text"] for h in hits) or "(no relevant information found)"
        system_prompt = build_system_prompt(mode, context)
        temp = 0.3

    system_prompt = apply_style(system_prompt, style)
    return {"system_prompt": system_prompt, "temperature": temp, "sources": sources}


def stream_groq(system_prompt: str, messages: list[dict], temperature: float) -> Iterator[str]:
    if not config.GROQ_API_KEY:
        yield "The server is missing its GROQ_API_KEY. Please set it in the backend environment."
        return

    from groq import Groq

    client = Groq(api_key=config.GROQ_API_KEY)
    try:
        stream = client.chat.completions.create(
            model=config.GROQ_MODEL,
            temperature=temperature,
            max_tokens=900,
            stream=True,
            messages=[{"role": "system", "content": system_prompt}, *messages],
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
    except Exception as err:
        yield f"\n\n[Error talking to the model: {err}]"


def stream_chat(
    messages: list[dict],
    mode: str = "portfolio",
    *,
    user_id: str | None = None,
    temperature: float = 0.7,
    style: str | None = "plain",
) -> tuple[list[dict], Iterator[str]]:
    """Prepare retrieval + return (sources, text_stream)."""
    prep = prepare_chat(messages, mode, user_id=user_id, temperature=temperature, style=style)
    gen = stream_groq(prep["system_prompt"], messages, prep["temperature"])
    return prep["sources"], gen


def sources_header(sources: list[dict]) -> str:
    return json.dumps(sources)
