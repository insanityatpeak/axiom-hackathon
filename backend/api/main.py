from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime

app = FastAPI(title="AXIOM Backend (Band SDK Simulator)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "orchestrator": "Band SDK Active", "agents_registered": 12}

@app.get("/api/memory")
def get_memory_graph():
    return {
        "status": "mock",
        "description": "Returns Neo4j/pgvector graph data for frontend d3 visualization."
    }

@app.post("/api/task")
def submit_task(payload: dict):
    return {"status": "accepted", "task_id": "axiom-task-001"}

@app.websocket("/ws/orchestra")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logs = [
        "Initializing Band SDK room...",
        "Planner Agent: Analyzing task decomposition",
        "Memory Curator: Querying prior rate-limiting patterns...",
        "Architect Agent: Validating approach against ADRs",
        "Engineer Agent (x3): Fan-out implementation started",
        "Code Review Agent: Running 3-lens review (Correctness/Perf/Sec)",
        "Consensus Mediator: Debate triggered between Architect and Reviewer",
        "Test Intelligence: Generating mutation-aware coverage",
        "CI/CD Coordinator: Building impact-scoped matrix",
        "Release Manager: Computing Readiness Score",
    ]
    try:
        for log in logs:
            await asyncio.sleep(1.5)
            await websocket.send_json({
                "time": datetime.now().strftime("%I:%M:%S %p"),
                "msg": log
            })
        await asyncio.sleep(2)
        await websocket.send_json({
            "time": datetime.now().strftime("%I:%M:%S %p"),
            "msg": "Task completed. PR Generated."
        })
    except WebSocketDisconnect:
        print("Client disconnected")
