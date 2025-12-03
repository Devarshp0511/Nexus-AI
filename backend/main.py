from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from core.database import engine, get_db, Base
from app import models, schemas
from agents.graph import app as agent_app  # <--- IMPORT THE BRAIN

# 1. Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nexus AI", version="1.0.0")

# Setup CORS (Allows Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "active", "system": "Nexus AI"}

# --- DATABASE CRUD ---
@app.post("/projects/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(name=project.name, description=project.description)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects/", response_model=list[schemas.ProjectResponse])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

# --- NEW: AGENT EXECUTION ENDPOINT ---
@app.post("/agent/run", response_model=schemas.MissionResponse)
def run_agent_mission(request: schemas.MissionRequest, db: Session = Depends(get_db)): # <--- ADD db dependency
    print(f"🚀 API Triggered: Starting mission '{request.mission}'")
    
    try:
        # 1. Run the Agent
        result = agent_app.invoke({"mission": request.mission})
        plan = result.get("plan", [])
        report = result.get("final_response", "No report generated.")
        
        # 2. SAVE TO POSTGRES (The "Memory")
        # We store the mission name as the title, and the report as the description
        db_project = models.Project(
            name=f"Mission: {request.mission[:30]}...", # Short title
            description=report, # Store the full AI report here
            status="completed"
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        print(f"💾 Saved to Database with ID: {db_project.id}")

        return {
            "mission": request.mission,
            "plan": plan,
            "final_report": report
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)