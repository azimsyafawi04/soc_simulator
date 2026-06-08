from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, logs, alerts, ws

app = FastAPI(
    title="Educational SIEM Platform API",
    description="FastAPI backend for SIEM FYP",
    version="1.0.0"
)

# Allow React frontend to communicate with API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(logs.router, prefix="/api/logs", tags=["Log Ingestion"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(ws.router, prefix="/api/ws", tags=["WebSockets"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "SIEM API is running"}
