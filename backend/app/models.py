from sqlalchemy import Column, Integer, String, Text, DateTime, func
# OLD (Error):
# from backend.core.database import Base

# NEW (Correct):
from core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g., "Quantum Research"
    description = Column(Text)        # e.g., "Find papers on Qubits..."
    status = Column(String, default="pending") # pending, running, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())