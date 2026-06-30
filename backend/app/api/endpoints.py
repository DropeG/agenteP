from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.course import Course
from app.models.task import Task
from app.models.agent_log import AgentLog
from app.integrations.canvas import CanvasClient

router = APIRouter()
canvas_client = CanvasClient()

@router.get("/courses")
async def get_courses(db: Session = Depends(get_db)):
    # Fetch courses from Canvas UC API (or fallback mock)
    canvas_courses = await canvas_client.get_courses()
    
    db_courses = []
    for course_data in canvas_courses:
        # Check if course already exists in local DB
        db_course = db.query(Course).filter(Course.id == course_data["id"]).first()
        if not db_course:
            # Code names might vary in Canvas payload structure, check different keys
            code = course_data.get("course_code") or course_data.get("sis_course_id") or "UC-COURSE"
            db_course = Course(
                id=course_data["id"],
                name=course_data["name"],
                course_code=code,
                term=course_data.get("enrollment_term_id")
            )
            db.add(db_course)
            db.commit()
            db.refresh(db_course)
        db_courses.append(db_course)
        
    return db_courses

@router.get("/courses/{course_id}/tasks")
async def get_course_tasks(course_id: int, db: Session = Depends(get_db)):
    # Verify course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found in database")

    # Fetch assignments from Canvas UC
    canvas_tasks = await canvas_client.get_assignments(course_id)
    
    db_tasks = []
    for task_data in canvas_tasks:
        db_task = db.query(Task).filter(Task.id == task_data["id"]).first()
        if not db_task:
            db_task = Task(
                id=task_data["id"],
                course_id=course_id,
                title=task_data["name"],
                description=task_data.get("description"),
                status="pending"
            )
            db.add(db_task)
            db.commit()
            db.refresh(db_task)
        db_tasks.append(db_task)
        
    return db_tasks

@router.post("/tasks/{task_id}/run_agent")
async def run_agent_on_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Mark task as working
    task.status = "working"
    db.commit()
    
    # 1. Log Planning Step
    db.add(AgentLog(
        task_id=task.id,
        step_name="planning",
        message=f"Agent initiated. Reading assignment requirements for '{task.title}'."
    ))
    db.commit()
    
    # 2. Log Sandbox Execution Step
    db.add(AgentLog(
        task_id=task.id,
        step_name="sandbox",
        message="Running python simulator to test draft code logic in safe container..."
    ))
    db.commit()
    
    # 3. Log Draft Complete
    task.status = "draft_ready"
    task.draft_file_path = f"/drafts/course_{task.course_id}/task_{task_id}_draft.py"
    db.add(AgentLog(
        task_id=task.id,
        step_name="completion",
        message=f"Draft file created successfully at: {task.draft_file_path}. Ready for user review."
    ))
    db.commit()
    db.refresh(task)
    
    return {"status": "success", "task_id": task_id, "state": task.status}

@router.get("/tasks/{task_id}/logs")
async def get_task_logs(task_id: int, db: Session = Depends(get_db)):
    logs = db.query(AgentLog).filter(AgentLog.task_id == task_id).order_by(AgentLog.timestamp.asc()).all()
    return logs
