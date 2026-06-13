"""The RAG core: chunking, embeddings, and similarity search.

This module is intentionally simple and transparent so the retrieval logic is
easy to explain: we split markdown into chunks, turn each chunk into a vector
with a local embedding model, and find the closest chunks to a question using
cosine similarity.
"""
import json
import re
from functools import lru_cache

import numpy as np

from app import config


@lru_cache(maxsize=1)
def get_embedder():
    """Load the embedding model once and reuse it (it is a heavy object)."""
    from fastembed import TextEmbedding

    return TextEmbedding(model_name=config.EMBED_MODEL)


def embed_texts(texts):
    """Return a list of float32 vectors, one per input text."""
    model = get_embedder()
    return [np.asarray(v, dtype=np.float32) for v in model.embed(list(texts))]


def embed_query(text):
    return embed_texts([text])[0]


def _make_chunk(source: str, heading: str, body: str) -> dict:
    label = f"[{source}" + (f" \u2014 {heading}]" if heading else "]")
    return {"source": source, "heading": heading, "text": f"{label}\n{body}"}


def chunk_markdown(text: str, source: str, max_chars: int = 900) -> list[dict]:
    """Split markdown into chunks, first by heading, then by length.

    Each chunk keeps a small `[source - heading]` label so the model can see
    (and cite) where the information came from.
    """
    sections: list[tuple[str, str]] = []
    heading = ""
    buf: list[str] = []

    def flush():
        body = "\n".join(buf).strip()
        if body:
            sections.append((heading, body))

    for line in text.splitlines():
        if re.match(r"^#{1,6}\s", line):
            flush()
            buf = []
            heading = line.lstrip("#").strip()
        else:
            buf.append(line)
    flush()

    chunks: list[dict] = []
    for heading, body in sections:
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
        current = ""
        for para in paragraphs:
            if current and len(current) + len(para) + 2 > max_chars:
                chunks.append(_make_chunk(source, heading, current))
                current = para
            else:
                current = f"{current}\n\n{para}" if current else para
        if current:
            chunks.append(_make_chunk(source, heading, current))
    return chunks


@lru_cache(maxsize=1)
def load_index():
    """Load the precomputed knowledge index and a normalized vector matrix."""
    data = json.loads(config.INDEX_PATH.read_text(encoding="utf-8"))
    chunks = data["chunks"]
    matrix = np.asarray([c["vector"] for c in chunks], dtype=np.float32)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1e-9
    return chunks, matrix / norms


def search(query: str, top_k: int | None = None) -> list[dict]:
    """Return the top-k most relevant chunks for a query, with scores."""
    top_k = top_k or config.TOP_K
    try:
        chunks, matrix = load_index()
    except FileNotFoundError:
        return []

    q = embed_query(query)
    q = q / (np.linalg.norm(q) or 1e-9)
    scores = matrix @ q
    top_idx = np.argsort(scores)[::-1][:top_k]
    return [
        {
            "text": chunks[i]["text"],
            "source": chunks[i]["source"],
            "heading": chunks[i].get("heading", ""),
            "score": float(scores[i]),
        }
        for i in top_idx
    ]
