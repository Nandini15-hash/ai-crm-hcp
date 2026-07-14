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

1. Log Interaction
2. Edit Interaction
3. Search HCP
4. Follow-up Reminder
5. Visit Summary

---

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload
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