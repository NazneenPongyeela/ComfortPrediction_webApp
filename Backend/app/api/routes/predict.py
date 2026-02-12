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


try:
    with MODEL_PATH.open("rb") as model_file:
        model = pickle.load(model_file)
except Exception:
    model = None


@router.post("/predict")
def predict(data: PredictionInput, user=Depends(verify_token)):
    if model is None:
        raise HTTPException(status_code=500, detail="Prediction model is not available")

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
