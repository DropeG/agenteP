from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.core.database import Base

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    step_name = Column(String, nullable=False)           # e.g., planning, coding, review, self-correct
    message = Column(Text, nullable=False)

    task = relationship("Task", back_populates="logs")
