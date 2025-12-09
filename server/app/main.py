import asyncio
# Monkeypatch asyncio.coroutine for Motor 2.5.1 compatibility with Python 3.14
if not hasattr(asyncio, 'coroutine'):
    asyncio.coroutine = lambda x: x

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import auth, todos

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.Cors.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(auth.router)
app.include_router(todos.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Todo App API"}
