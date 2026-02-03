from fastapi import FastAPI, Depends
from auth import verify_token
from schemas_ import PredictionInput, PatientCreate, PatientUpdate
from preprocess.pipeline import preprocess_features
from model_loader import predict, format_prediction
from firebase import (
    save_result,
    get_patients,
    add_patient,
    update_patient,
    delete_patient
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

@app.post("/predict")
def predict_signal(
    data: PredictionInput,
    user=Depends(verify_token)
):
    raw_data = data.dict()

    processed = preprocess_features(raw_data)

    prediction_value = int(predict(processed))  # 🔥 แปลงเป็น int
    prediction_label = format_prediction(prediction_value)

    save_result(
        hospital_number=raw_data["hospital_number"],
        raw_data=raw_data,
        processed_features=processed,
        prediction=prediction_value,
        prediction_label=prediction_label,
        user_uid=user["uid"]
    )

    return {
        "hospital_number": raw_data["hospital_number"],
        "prediction": prediction_label,
        "prediction_value": prediction_value,
        "processed_features": processed,
        "user": user
    }


@app.get("/patients")
def list_patients(user=Depends(verify_token)):
    return get_patients(user["uid"])


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