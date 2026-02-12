from firebase_admin import db, exceptions as firebase_exceptions
from datetime import datetime
import uuid
from app import firebase_init

def save_result(
    hospital_number: str,
    raw_data: dict,
    processed_features: dict,
    prediction: int,
    prediction_label: str | None = None,
    user_uid: str | None = None
):
    path = f"/Predictions/{hospital_number}"

    ref = db.reference(path)

    prediction_id = str(uuid.uuid4())
    result = {
        "id": prediction_id,
        "timestamp": datetime.utcnow().isoformat(),
        "raw_data": raw_data,
        "processed_features": processed_features,
        "prediction": prediction,
    }

    if prediction_label is not None:
        result["prediction_label"] = prediction_label
    if user_uid:
        result["user_uid"] = user_uid

    ref.child(prediction_id).set(result)
    if user_uid and prediction_label is not None:
        update_patient_status_by_hn(
            user_uid=user_uid,
            hospital_number=hospital_number,
            prediction_label=prediction_label,
            updated_at=result["timestamp"]
        )
    return prediction_id


def get_prediction_history(hospital_number: str, user_uid: str):
    ref = db.reference(f"/Predictions/{hospital_number}")
    data = ref.get() or {}
    records = []
    if isinstance(data, dict):
        for key, value in data.items():
            if not isinstance(value, dict):
                continue
            if value.get("user_uid") not in (None, user_uid):
                continue
            record = {**value}
            record.setdefault("id", key)
            records.append(record)
    records.sort(key=lambda item: item.get("timestamp", ""), reverse=True)
    return records


def get_patients(user_uid: str):
    ref = db.reference(f"/patients/{user_uid}")
    return ref.get() or {}


def get_patient(user_uid: str, patient_id: str):
    ref = db.reference(f"/patients/{user_uid}/{patient_id}")
    return ref.get()


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


def update_patient_status_by_hn(
    user_uid: str,
    hospital_number: str,
    prediction_label: str,
    updated_at: str | None = None
):
    ref = db.reference(f"/patients/{user_uid}")
    try:
        matches = ref.order_by_child("hospital_number").equal_to(hospital_number).get() or {}
    except firebase_exceptions.InvalidArgumentError:
        data = ref.get() or {}
        if isinstance(data, dict):
            matches = {
                patient_id: patient_data
                for patient_id, patient_data in data.items()
                if isinstance(patient_data, dict)
                and patient_data.get("hospital_number") == hospital_number
            }
        else:
            matches = {}
    timestamp = updated_at or datetime.utcnow().isoformat()
    for patient_id in matches.keys():
        ref.child(patient_id).update(
            {
                "status": prediction_label,
                "status_updated_at": timestamp,
            }
        )

def delete_patient(user_uid: str, patient_id: str):
    ref = db.reference(f"/patients/{user_uid}/{patient_id}")
    ref.delete()
