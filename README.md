# Grounded

A full-stack portfolio chatbot that lets recruiters explore **Aseel Herzallah's** background through natural conversation — with answers grounded in verified profile content, not open-ended guessing.

**Live demo:** *(add URL after deploy)*

---

## 💬 What it does

Visitors land on a public portfolio chat interface and can ask about projects, skills, experience, education, and role fit. The assistant answers in the third person, cites retrieved sources, and stays within the knowledge base.

Signed-in users get a private **workspace**: persistent conversations, file uploads for personal RAG, and settings for response tone and model temperature.

Three public modes tailor the experience:

| Mode | Purpose |
|------|---------|
| **About Me** | Friendly overview of background and strengths |
| **For Recruiters** | Hiring-manager briefing — fit, evidence, stack |
| **Role Fit** | Paste a job description; get structured match analysis |

---

## 🏗️ Architecture

```
content/*.md  →  chunk + embed  →  vector index
                                        │
User question  →  embed  →  cosine search  →  top chunks
                                        │
                              Groq LLM (streamed answer + sources)
```

| Layer | Stack |
|-------|--------|
| **Frontend** | Next.js 16 (App Router), React, Tailwind CSS v4, Auth.js (Google OAuth) |
| **Backend** | FastAPI, Groq API, FastEmbed (local embeddings), NumPy cosine retrieval |
| **Knowledge** | Markdown profile documents → chunked, embedded, stored as `knowledge.json` |

The browser talks directly to the FastAPI backend for chat streaming. Auth and optional conversation storage run through Next.js API routes.

---

## ✨ Features

- **Retrieval-augmented generation (RAG)** — answers constrained to indexed profile documents
- **Streaming responses** — token-by-token output with source panel per reply
- **Response tones** — Plain, Technical, Notes, Pitch, Code (prompt-level style control)
- **Rotating suggested questions** — six starters on home; four replaceable chips in chat
- **Role Fit mode** — structured comparison against a pasted job description
- **Google sign-in** — public portfolio vs. private workspace with post-login routing
- **Per-user document RAG** — upload `.md` / `.txt` in workspace for personal context
- **Dark cosmic UI** — portfolio-aligned theme, compact composer, mode tabs

---

## 📁 Project structure

```
├── frontend/          Next.js app (public chat + signed-in workspace)
├── backend/
│   ├── app/           FastAPI routes, RAG, chat prompts, user uploads
│   ├── content/       Profile knowledge base (about, projects, skills, …)
│   ├── data/          Pre-built vector index
│   └── scripts/       Index builder
└── render.yaml        Backend deploy blueprint
```

---

## 🎓 What I built & learned

- **End-to-end RAG pipeline** — chunking markdown, embedding with `BAAI/bge-small-en-v1.5`, similarity search, and prompt injection with strict grounding rules
- **Grounded prompt design** — third-person recruiter voice, length control, inline answers (no “see the About page”), mode- and tone-specific system prompts
- **Split UX** — stateless public bot vs. authenticated workspace with sidebar, archives, and local persistence
- **Streaming UX** — SSE-style plain-text stream with `X-RAG-Sources` header parsed on the client
- **Auth flow** — Auth.js v5 + Google OAuth, custom error page, profile menu, sign-in → workspace redirect
- **Product polish** — rotating question pools, separated composer layout, professional hero mark, responsive footer controls

---

## 🛠️ Tech highlights

- **Next.js App Router** — client components, layout, API routes for auth and optional MongoDB conversations
- **FastAPI** — CORS, multipart uploads, streaming `StreamingResponse`
- **Groq** — `llama-3.3-70b-versatile` for fast inference
- **No vector DB required** — precomputed embeddings in JSON for simple deploy and zero extra infra

---

## 👋 Author

**Aseel Herzallah** — Junior Software Engineer · Full-Stack · Generative AI · Systems

Portfolio: [aseel-portfolio-mauve.vercel.app](https://aseel-portfolio-mauve.vercel.app)
