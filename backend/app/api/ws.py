from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
from app.core.redis_client import redis_client

router = APIRouter()

@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    pubsub = redis_client.pubsub()
    pubsub.subscribe("siem_alerts_channel")
    
    try:
        while True:
            # Poll redis pubsub
            message = pubsub.get_message(ignore_subscribe_messages=True)
            if message and message['type'] == 'message':
                await websocket.send_text(message['data'])
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pubsub.unsubscribe("siem_alerts_channel")
        print("WebSocket client disconnected")
