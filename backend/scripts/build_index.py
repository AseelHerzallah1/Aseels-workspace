"""Build the embeddings index from the markdown files in `content/`.

Run this whenever you edit your knowledge files:

    python scripts/build_index.py

It reads every `*.md` in `content/`, splits them into chunks, embeds each
chunk locally, and writes `data/knowledge.json` (text + vectors).
"""
import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app import config, rag  # noqa: E402


def main():
    files = sorted(config.CONTENT_DIR.glob("*.md"))
    if not files:
        print(f"No markdown files found in {config.CONTENT_DIR}")
        return

    chunks: list[dict] = []
    for path in files:
        text = path.read_text(encoding="utf-8")
        file_chunks = rag.chunk_markdown(text, path.stem)
        chunks.extend(file_chunks)
        print(f"  {path.name}: {len(file_chunks)} chunks")

    print(f"\nEmbedding {len(chunks)} chunks with {config.EMBED_MODEL} ...")
    vectors = rag.embed_texts([c["text"] for c in chunks])
    for chunk, vector in zip(chunks, vectors):
        chunk["vector"] = vector.tolist()

    config.DATA_DIR.mkdir(parents=True, exist_ok=True)
    config.INDEX_PATH.write_text(
        json.dumps({"model": config.EMBED_MODEL, "chunks": chunks}),
        encoding="utf-8",
    )
    print(f"Wrote {len(chunks)} chunks -> {config.INDEX_PATH}")


if __name__ == "__main__":
    main()
