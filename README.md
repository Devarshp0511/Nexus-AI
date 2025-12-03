<div align="center">

# 🔮 NEXUS AI
### The Autonomous Research Architect

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/AI_Orchestration-LangGraph-FF4B4B?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**An Event-Driven, Multi-Agent Cognitive Architecture designed to autonomously plan, research, and synthesize complex technical reports.**

[View Live Demo](https://nexus-ai-demo.com) · [Report Bug](https://github.com/Devarshp0511/Nexus-AI/issues) · [Request Feature](https://github.com/Devarshp0511/Nexus-AI/issues)

</div>

---

## 🚀 Executive Summary

**Nexus AI** represents a shift from "Chatbots" to **"Agentic Systems."**

While traditional LLMs generate text in a single pass, Nexus employs a **Graph-Based State Machine** to coordinate specialized autonomous agents. It creates a dynamic loop where a **Planner** deconstructs goals, a **Researcher** gathers ground-truth data from the live web, and a **Writer** synthesizes the findings into professional-grade reports. 

The system runs on a **Microservices Architecture** orchestrated via Docker, ensuring persistent memory and scalable execution separate from the user interface.

![Dashboard Demo](nexus_demo.png)

---

## 🏗️ System Architecture

Nexus operates on a distributed containerized stack. The **Brain** (Python) interacts with the **Body** (Docker Services) via asynchronous protocols.

```mermaid
graph TD
    User[User / Next.js Dashboard] -->|REST API| API[FastAPI Gateway]
    API -->|Trigger| Graph[LangGraph Orchestrator]
    
    subgraph "The Cognitive Architecture"
    Graph -->|Step 1| Planner[Planner Agent]
    Graph -->|Step 2| Research[Researcher Agent]
    Graph -->|Step 3| Writer[Writer Agent]
    end
    
    subgraph "Infrastructure Layer (Docker)"
    Research -->|Live Web Search| DDG[DuckDuckGo Tool]
    Graph -->|Persist State| Postgres[(PostgreSQL)]
    Graph -->|Semantic Memory| Qdrant[(Qdrant Vector DB)]
    Graph -->|Relationship Map| Neo4j[(Neo4j Graph DB)]
    end
    
    Writer -->|Final Markdown| Postgres
    Postgres -->|Fetch History| API
