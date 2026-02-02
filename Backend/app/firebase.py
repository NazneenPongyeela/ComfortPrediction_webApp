from firebase_admin import db
from datetime import datetime
import uuid
import firebase_init

def save_result(
    hospital_number: str,
    raw_data: dict,
    processed_features: dict,
    prediction: int,
    user_uid: str | None = None
):
    path = f"/Predictions/{hospital_number}"

    ref = db.reference(path)

    result = {
        "timestamp": datetime.utcnow().isoformat(),
        "raw_data": raw_data,
        "processed_features": processed_features,
        "prediction": prediction,
    }

    if user_uid:
        result["user_uid"] = user_uid

    ref.set(result)


def get_patients(user_uid: str):
    ref = db.reference(f"/patients/{user_uid}")
    return ref.get() or {}


def add_patient(user_uid: str, data: dict):
    ref = db.reference(f"/patients/{user_uid}")

    patient_id = str(uuid.uuid4())
    payload = {
        **data,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    ref.child(patient_id).set(payload)
    return patient_id


def update_patient(user_uid: str, patient_id: str, data: dict):
    ref = db.reference(f"/patients/{user_uid}/{patient_id}")
    data["updated_at"] = datetime.utcnow().isoformat()
    ref.update(data)


def delete_patient(user_uid: str, patient_id: str):
    ref = db.reference(f"/patients/{user_uid}/{patient_id}")
    ref.delete()
