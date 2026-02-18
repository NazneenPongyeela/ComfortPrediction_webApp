import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from .auth import verify_token
from .api.routes.predict import router as predict_router
from .schemas_ import PatientCreate, PatientUpdate
from .firebase import (
    get_patients,
    get_patient,
    get_prediction_history,
    add_patient,
    update_patient,
    delete_patient,
)

app = FastAPI()

def _parse_allowed_origins() -> list[str]:
    origins = ["http://localhost:5173"]

    frontend_url = os.getenv("FRONTEND_URL", "")
    frontend_urls = os.getenv("FRONTEND_URLS", "")

    configured = [frontend_url, frontend_urls]
    for item in configured:
        if not item:
            continue
        for origin in item.split(","):
            normalized = origin.strip().rstrip("/")
            if normalized and normalized not in origins:
                origins.append(normalized)
    return origins


allowed_origins = _parse_allowed_origins()
allowed_origin_regex = os.getenv("FRONTEND_ORIGIN_REGEX")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)


@app.get("/patients")
def list_patients(user=Depends(verify_token)):
    return get_patients(user["uid"])

@app.get("/patients/{patient_id}")
def read_patient(patient_id: str, user=Depends(verify_token)):
    return get_patient(user["uid"], patient_id)


@app.post("/patients")
def create_patient(patient: PatientCreate, user=Depends(verify_token)):
    pid = add_patient(user["uid"], patient.dict())
    return {"id": pid, "patient": patient}


@app.put("/patients/{patient_id}")
def edit_patient(patient_id: str, patient: PatientUpdate, user=Depends(verify_token)):
    data = patient.dict(exclude_none=True)
    update_patient(user["uid"], patient_id, data)
    return {"status": "updated"}


@app.delete("/patients/{patient_id}")
def remove_patient(patient_id: str, user=Depends(verify_token)):
    delete_patient(user["uid"], patient_id)
    return {"status": "deleted"}

@app.get("/predictions/{hospital_number}")
def list_predictions(hospital_number: str, user=Depends(verify_token)):
    return get_prediction_history(hospital_number, user["uid"])
