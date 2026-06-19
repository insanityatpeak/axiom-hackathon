# AXIOM — Autonomous Multi-Agent Software Engineering Intelligence

This repository contains the submission for the **Band of Agents Hackathon 2026 · Track 2: Multi-Agent Software Development**.

## Project Structure

```text
axiom/
├── backend/       # FastAPI + Band SDK AI Orchestration (Stub for Hackathon Demo)
├── frontend/      # React + Vite + TypeScript (Full Interactive UI)
└── AXIOM_SUBMISSION.md # Detailed Architectural Documentation
```

## How to Run the Demo Locally

We have provided a fully interactive "Demo Mode" frontend that simulates the complex multi-agent execution pipeline, consensus protocol, and technical debt ledger.

### 1. Start the Frontend
The frontend is a fully polished React application that visualizes the Band SDK agent orchestra.

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
Click **"Connect GitHub"** and then **"Run AXIOM"** to watch the simulated agent execution in real-time.

### 2. View the Backend Architecture
Navigate to the `backend/` directory to review the intended system architecture. Due to the hackathon timeframe and external API dependencies, the backend is provided as a structural stub demonstrating how the Band SDK Orchestrator, Consensus Mediator, and 12 Agents are organized.

## Documentation
Please read the complete architecture and vision in [AXIOM_SUBMISSION.md](./AXIOM_SUBMISSION.md).
