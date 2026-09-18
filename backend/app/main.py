from fastapi import Depends, FastAPI

from app.database import get_supabase_client
from app.security import verify_internal_api_key
from app.services.automation_service import (
    schedule_pending_enrollments,
)

app = FastAPI(
    title="La Bonne Relance API",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/database")
def database_health_check() -> dict[str, str]:
    supabase = get_supabase_client()

    supabase.table("automations").select("id").limit(1).execute()

    return {
        "status": "ok",
        "database": "connected",
    }


@app.post(
    "/jobs/schedule-enrollments",
    dependencies=[Depends(verify_internal_api_key)],
)
def run_enrollment_scheduler() -> dict[str, int]:
    return schedule_pending_enrollments()