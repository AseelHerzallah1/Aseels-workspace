"""Per-user document storage and retrieval for signed-in assistant mode."""
import json
import re
from pathlib import Path

from app import config, rag

USERS_DIR = config.DATA_DIR / "users"
ALLOWED_EXT = {".md", ".txt"}


def safe_user_id(user_id: str) -> str:
    """Turn an email/user id into a safe folder name."""
    return re.sub(r"[^a-zA-Z0-9._-]", "_", user_id.strip())


def user_dir(user_id: str) -> Path:
    return USERS_DIR / safe_user_id(user_id)


def uploads_dir(user_id: str) -> Path:
    return user_dir(user_id) / "uploads"


def index_path(user_id: str) -> Path:
    return user_dir(user_id) / "knowledge.json"


def list_documents(user_id: str) -> list[str]:
    folder = uploads_dir(user_id)
    if not folder.exists():
        return []
    return sorted(p.name for p in folder.iterdir() if p.is_file())


def save_document(user_id: str, filename: str, content: bytes) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise ValueError(f"Unsupported file type '{ext}'. Use .md or .txt")

    folder = uploads_dir(user_id)
    folder.mkdir(parents=True, exist_ok=True)
    safe_name = Path(filename).name
    path = folder / safe_name
    path.write_bytes(content)
    rebuild_user_index(user_id)
    return safe_name


def rebuild_user_index(user_id: str) -> int:
    folder = uploads_dir(user_id)
    chunks: list[dict] = []

    if folder.exists():
        for path in sorted(folder.glob("*")):
            if path.suffix.lower() not in ALLOWED_EXT:
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            file_chunks = rag.chunk_markdown(text, path.stem)
            chunks.extend(file_chunks)

    if not chunks:
        idx = index_path(user_id)
        if idx.exists():
            idx.unlink()
        return 0

    vectors = rag.embed_texts([c["text"] for c in chunks])
    for chunk, vector in zip(chunks, vectors):
        chunk["vector"] = vector.tolist()

    out = index_path(user_id)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps({"model": config.EMBED_MODEL, "chunks": chunks}),
        encoding="utf-8",
    )
    return len(chunks)


def search_user(user_id: str, query: str, top_k: int | None = None) -> list[dict]:
    path = index_path(user_id)
    if not path.exists():
        return []

    import numpy as np

    data = json.loads(path.read_text(encoding="utf-8"))
    chunks = data["chunks"]
    matrix = np.asarray([c["vector"] for c in chunks], dtype=np.float32)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1e-9
    matrix = matrix / norms

    q = rag.embed_query(query)
    q = q / (np.linalg.norm(q) or 1e-9)
    scores = matrix @ q
    k = top_k or config.TOP_K
    top_idx = np.argsort(scores)[::-1][:k]
    return [
        {
            "text": chunks[i]["text"],
            "source": chunks[i]["source"],
            "heading": chunks[i].get("heading", ""),
            "score": float(scores[i]),
        }
        for i in top_idx
    ]
