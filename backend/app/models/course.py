from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)  # Canvas Course ID
    name = Column(String, nullable=False)
    course_code = Column(String, nullable=False)        # e.g., MAT1620
    term = Column(String, nullable=True)

    tasks = relationship("Task", back_populates="course", cascade="all, delete-orphan")
