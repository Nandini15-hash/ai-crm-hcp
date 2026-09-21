# AI-First CRM HCP Module

## Overview

This project is an AI-powered Customer Relationship Management (CRM) system designed for Healthcare Professional (HCP) interactions. It enables pharmaceutical sales representatives to log, edit, search, and summarize interactions using both a structured form and an AI conversational interface.

---

## Features

- AI Chat Assistant (Groq + LangGraph)
- Log HCP Interaction
- Edit Interaction
- Search HCP
- Follow-up Reminder
- Visit Summary
- Dashboard Analytics
- Interaction History
- CRUD Operations
- SQLite Database

---

## Tech Stack

### Frontend

- React
- Redux
- Material UI
- Axios
- Recharts

### Backend

- FastAPI
- Python
- LangGraph
- Groq LLM (Llama 3.3 70B Versatile)
- SQLAlchemy
- SQLite

---

## AI Workflow

User

↓

React Frontend

↓

FastAPI Backend

↓

LangGraph Agent

↓

Groq LLM

↓

Tool Execution

↓

Database

↓

Frontend Response

---

## LangGraph Tools

The AI Chat Assistant first classifies what you're asking for, then routes to
the matching tool — it's not limited to only logging interactions:

1. **Log Interaction** — "Met with Dr. Rao today, discussed the new cardiac drug, follow up next Friday."
2. **Edit Interaction** — "Update the notes for Dr. Rao to say we're waiting on samples."
3. **Search HCP** — "What have we discussed with Dr. Mehta?"
4. **Follow-up Reminder** — "What follow-ups do I have pending?"
5. **Visit Summary** — "Give me a summary of all visits so far."

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

copy .env.example .env
```

Open `.env` and set `GROQ_API_KEY` to a key from https://console.groq.com/keys — the AI Chat Assistant won't work without it (the rest of the app, including the manual form/history/dashboard, works fine even without a key).

```bash
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

GET /

GET /health

POST /chat

POST /interaction

PUT /interaction

DELETE /interaction/{id}

GET /interactions

GET /search-hcp/{hcp_name}

GET /followups

GET /visit-summary

---

## Project Structure

```
frontend/
backend/
README.md
```

---

## Author

Nandini M C