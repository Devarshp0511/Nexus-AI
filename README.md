<div align="center">

# 🔮 NEXUS AI
### The Autonomous Research Architect

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/AI_Orchestration-LangGraph-FF4B4B?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**An Event-Driven, Multi-Agent Cognitive Architecture designed to autonomously plan, research, and synthesize complex technical reports.**

[View Live Demo](https://drive.google.com/file/d/1yfH0-2TMERt8SYThCJAg4NBvh1Rybi_i/view?usp=sharing) · [Report Bug](https://github.com/Devarshp0511/Nexus-AI/issues) · [Request Feature](https://github.com/Devarshp0511/Nexus-AI/issues)

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
```
# 🧠 The Agentic Brain (Code Deep Dive)
Unlike standard chains, Nexus uses LangGraph to define a cyclic workflow. Below is the actual logic governing the agent swarm.

### 1. The State Machine (state.py)
Every agent shares a "Brain" (State). This ensures the Researcher knows what the Planner decided, and the Writer sees what the Researcher found.
```Python
class AgentState(TypedDict):
    mission: str                # User's initial goal
    plan: List[str]             # Step-by-step execution plan
    research_data: List[str]    # Raw data gathered from the web
    final_response: str         # The synthesized report
    revision_number: int        # Counter for self-correction loops
```
### 2. The Planner Node (nodes.py)
This agent uses Llama-3-70b (via Groq) to function as a Project Manager. It forces a structured JSON output to ensure the plan is machine-readable.
```Python
def planner_node(state: AgentState):
    print(f"--- PLANNER: Analyzing mission... ---")
    prompt = f"You are a Senior Architect. Break this mission into 5 logical steps: {state['mission']}"
    
    # We use temperature=0 for strict logical reasoning
    response = llm.invoke([HumanMessage(content=prompt)])
    steps = parse_into_list(response.content)
    
    return {"plan": steps}
```
### 3. The Researcher Node (Tool Use)
This agent has "Hands." It utilizes the DuckDuckGo Search Tool to step outside the LLM's training data and fetch real-time information from 2025.
```Python
def researcher_node(state: AgentState):
    plan = state['plan']
    results = []
    
    for task in plan:
        # The agent autonomously executes web searches
        data = web_search.run(task)
        results.append(data)
        
    return {"research_data": results}
```
# 🧱 Technical Stack & Decisions

## <u>**Frontend:** The Mission Control</u>
* **Next.js 14 (App Router):** Chosen for Server-Side Rendering (SSR) to ensure high-performance dashboard loading.
* **Tailwind CSS v4:** Utilized for a "Glassmorphism" design system with hardware-accelerated animations.
* **Sonner & Framer Motion:** For reactive UI feedback (Toasts) and state transitions.

  
## **Backend:** The Nervous System
* **FastAPI:** Selected over Flask for its asynchronous capabilities (`async/await`), which are critical for handling long-running agent tasks without blocking the server.
* **SQLAlchemy (ORM):** Manages relational data mapping between Python objects and the PostgreSQL container.


## <u>**Infrastructure:** The Docker Cluster</u>
The system spins up 4 isolated containers via `docker-compose`:
1.  **PostgreSQL:** Stores user history and mission logs (Persistent Volume).
2.  **Qdrant:** (Vector DB) For semantic search and long-term memory retrieval.
3.  **Redis:** (Message Broker) Handles task queues for the Celery workers.
4.  **Neo4j:** (Graph DB) Maps relationships between researched entities.

   #  🔮 Roadmap

* [x] **Core Architecture:** LangGraph + FastAPI + Docker
* [x] **UI:** Next.js Dashboard with Real-time Feedback & Glassmorphism
* [x] **Persistence:** PostgreSQL History Saver & Mission Archives
* [x] **Export:** PDF Report Generation
* [x] **Self-Correction:** "Critic" Agent to grade reports and request re-writes.
* [x] **Multi-Modal:** Capability to read images and PDFs as source material.

# 💻 Installation & Setup
Prerequisite: Ensure Docker Desktop is installed and running.

### 1. Clone the Repository
```Bash
git clone [https://github.com/Devarshp0511/Nexus-AI.git](https://github.com/Devarshp0511/Nexus-AI.git)
cd nexus-ai
```

### 2. Ignite the Infrastructure
Spin up the database cluster in detached mode:
```Bash
docker-compose up -d
```

### 3. Configure Environment
Create a .env file in the backend/ directory:
```Ini, TOML
# Database Connection
DATABASE_URL=postgresql://nexus:nexus_password@localhost:5432/nexus_db

# AI Provider Key (Perplexity, Groq, or OpenAI)
PPLX_API_KEY="pplx-..." 
# OR
GROQ_API_KEY="gsk_..."
```

### 4. Launch the Brain (Backend)
```Bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 5. Launch the Interface (Frontend)
Open a new terminal tab:
```Bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 to access the Mission Control Center.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

<br>

<div align="center">
  <sub>Engineered with ❤️ by Devarsh Patel</sub>
</div>
