from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# What the user sends to us
class ProjectCreate(BaseModel):
    name: str
    description: str

# What we send back to the user (includes the ID and Date)
class ProjectResponse(ProjectCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- NEW: Agent Request/Response ---
class MissionRequest(BaseModel):
    mission: str

class MissionResponse(BaseModel):
    mission: str
    plan: list[str]
    final_report: str