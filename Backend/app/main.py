from fastapi import FastAPI, Depends
from auth import verify_token
from api.routes.predict import router as predict_router
from schemas_ import PatientCreate, PatientUpdate
from firebase import (
    get_patients,
    get_patient,
    get_prediction_history,
    add_patient,
    update_patient,
    delete_patient,
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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