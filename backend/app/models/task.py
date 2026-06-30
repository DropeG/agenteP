from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)  # Canvas Assignment ID
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)           # Assignment description/prompts
    due_at = Column(DateTime, nullable=True)
    status = Column(String, default="pending")          # pending, working, draft_ready, submitted, graded
    
    # Files & Drafts paths
    draft_file_path = Column(String, nullable=True)     # Path to local drafted file (py, pdf, docx)
    grade = Column(String, nullable=True)               # e.g., "7.0", "A", "100"
    feedback = Column(Text, nullable=True)              # Feedback comments from Canvas

    course = relationship("Course", back_populates="tasks")
    logs = relationship("AgentLog", back_populates="task", cascade="all, delete-orphan")
