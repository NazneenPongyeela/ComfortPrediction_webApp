from pathlib import Path
import pickle

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException

from auth import verify_token
from firebase import save_result
from schemas_ import PredictionInput

router = APIRouter()

MODEL_PATH = Path(__file__).resolve().parents[3] / "model" / "rf_model.pkl"
_FEATURES = [
    "windSpeed",
    "temperature",
    "humidity",
    "is_allergy",
    "skintemp",
    "bmi",
    "eda_tonic_b",
    "eda_phasic_b",
    "hf_n_ecg_b",
    "lf_n_ecg_b",
    "lfhf_ratio_ecg_b",
]


MODEL_LOAD_ERROR = None

try:
    with MODEL_PATH.open("rb") as model_file:
        model = pickle.load(model_file)
except Exception as exc:
    model = None
    MODEL_LOAD_ERROR = str(exc)


@router.post("/predict")
def predict(data: PredictionInput, user=Depends(verify_token)):
    if model is None:
        detail = "Prediction model is not available"
        if MODEL_LOAD_ERROR:
            detail = (
                f"{detail}. Failed to load model from {MODEL_PATH.name}: {MODEL_LOAD_ERROR}. "
                "Ensure scikit-learn version matches the training environment (expected 1.7.2)."
            )
        raise HTTPException(status_code=500, detail=detail)

    row = data.model_dump()
    row["is_allergy"] = int(bool(row["is_allergy"]))
    features = pd.DataFrame([[row[name] for name in _FEATURES]], columns=_FEATURES)

    prediction = int(model.predict(features)[0])
    label = "Comfort" if prediction == 0 else "Discomfort"

    prediction_id = save_result(
        hospital_number=data.hospital_number,
        raw_data=data.model_dump(),
        processed_features=features.iloc[0].to_dict(),
        prediction=prediction,
        prediction_label=label,
        user_uid=user.get("uid"),
    )

    return {
        "id": prediction_id,
        "prediction": prediction,
        "label": label,
    }
