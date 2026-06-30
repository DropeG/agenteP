import httpx
from app.core.config import settings

class CanvasClient:
    def __init__(self):
        self.api_url = settings.CANVAS_API_URL
        self.headers = {}
        if settings.CANVAS_API_TOKEN:
            self.headers["Authorization"] = f"Bearer {settings.CANVAS_API_TOKEN}"

    async def get_courses(self):
        """
        Fetches active courses for the student from Canvas UC.
        API Endpoint: GET /api/v1/courses
        """
        if not settings.CANVAS_API_TOKEN:
            return self._mock_courses()
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_url}/api/v1/courses",
                    headers=self.headers,
                    params={"enrollment_state": "active", "per_page": 50}
                )
                response.raise_for_status()
                return response.json()
        except Exception:
            # Fallback to mock if API request fails
            return self._mock_courses()

    async def get_assignments(self, course_id: int):
        """
        Fetches all assignments (tasks) for a specific course.
        API Endpoint: GET /api/v1/courses/{course_id}/assignments
        """
        if not settings.CANVAS_API_TOKEN:
            return self._mock_assignments(course_id)
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_url}/api/v1/courses/{course_id}/assignments",
                    headers=self.headers,
                    params={"per_page": 50}
                )
                response.raise_for_status()
                return response.json()
        except Exception:
            return self._mock_assignments(course_id)

    def _mock_courses(self):
        return [
            {"id": 101, "name": "Cálculo III", "course_code": "MAT1630", "enrollment_term_id": "2026-1"},
            {"id": 102, "name": "Introducción a la Programación", "course_code": "IIC1103", "enrollment_term_id": "2026-1"},
            {"id": 103, "name": "Física General", "course_code": "FIS1533", "enrollment_term_id": "2026-1"}
        ]

    def _mock_assignments(self, course_id: int):
        if course_id == 101:
            return [
                {"id": 201, "name": "Tarea 1: Integrales Múltiples", "description": "<p>Resolver los ejercicios de la guía adjunta y subir en PDF.</p>", "due_at": "2026-07-02T23:59:59Z"},
                {"id": 202, "name": "Proyecto: Aplicaciones Físicas", "description": "<p>Modelar el campo eléctrico mediante integrales de superficie.</p>", "due_at": "2026-07-15T23:59:59Z"}
            ]
        elif course_id == 102:
            return [
                {"id": 203, "name": "Taller 1: Condicionales y Bucles", "description": "<p>Crear un programa que simule un cajero automático en Python.</p>", "due_at": "2026-07-05T23:59:59Z"}
            ]
        return []
