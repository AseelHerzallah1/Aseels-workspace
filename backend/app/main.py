"""FastAPI entrypoint for Ask Aseel's Bot."""
import asyncio
from collections.abc import AsyncIterator, Iterator

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from starlette.concurrency import iterate_in_threadpool

from app import chat, config, rag, user_rag

app = FastAPI(title="Ask Aseel's Bot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-RAG-Sources"],
)


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    mode: str = "portfolio"
    user_id: str | None = None
    temperature: float = 0.7
    style: str | None = "plain"


async def _stream_bytes(token_iter: Iterator[str]) -> AsyncIterator[bytes]:
    """Yield UTF-8 chunks immediately — avoids Render/proxy response buffering."""
    async for token in iterate_in_threadpool(token_iter):
        if token:
            yield token.encode("utf-8")
            await asyncio.sleep(0)


@app.get("/health")
def health():
    try:
        chunks, _ = rag.load_index()
        indexed = len(chunks)
    except Exception:
        indexed = 0
    return {"status": "ok", "person": config.PERSON_NAME, "chunks_indexed": indexed}


@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    messages = [m.model_dump() for m in req.messages]
    sources, generator = chat.stream_chat(
        messages,
        req.mode,
        user_id=req.user_id,
        temperature=req.temperature,
        style=req.style,
    )
    return StreamingResponse(
        _stream_bytes(generator),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-RAG-Sources": chat.sources_header(sources),
        },
    )


@app.get("/documents")
def list_documents(user_id: str):
    return {"files": user_rag.list_documents(user_id)}


@app.post("/upload")
async def upload_document(user_id: str = Form(...), file: UploadFile = File(...)):
    content = await file.read()
    try:
        name = user_rag.save_document(user_id, file.filename or "upload.txt", content)
    except ValueError as err:
        return {"ok": False, "error": str(err)}
    chunks = user_rag.rebuild_user_index(user_id)
    return {"ok": True, "filename": name, "chunks_indexed": chunks}
