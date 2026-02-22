"""
SUNDAE Backend — FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import init_supabase, close_supabase
from app.routers import health, document, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hook."""
    # ── Startup ──────────────────────────────────────────────────
    await init_supabase()
    yield
    # ── Shutdown ─────────────────────────────────────────────────
    await close_supabase()


app = FastAPI(
    title="SUNDAE API",
    description="On-premise AI Chatbot SaaS Platform for Thai Government & SMEs",
    version="0.1.0",
    lifespan=lifespan,
)

# ── Middleware ───────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(document.router)
app.include_router(chat.router)
