from pathlib import Path
from io import BytesIO
import pickle
from typing import Any

import app
import joblib
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException

from app.auth import verify_token
from app.firebase import save_result
from app.schemas_ import PredictionInput

router = APIRouter()

MODEL_PATH = Path(app.__file__).resolve().parent.parent / "model" / "rf_model.pkl"
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

def _load_model(model_path: Path) -> Any:
    model_bytes = model_path.read_bytes()
    normalized_bytes = model_bytes.lstrip()

    if normalized_bytes.startswith(b"version https://git-lfs.github.com/spec/v1"):
        raise RuntimeError(
            "Model file is a Git LFS pointer, not the actual binary model. "
            "Pull LFS objects before starting the API."
        )

    try:
        return pickle.loads(normalized_bytes)
    except Exception as pickle_exc:
        try:
            return joblib.load(BytesIO(normalized_bytes))
        except Exception:
            raise RuntimeError(
                f"Unable to deserialize model file at {model_path}. "
                "The file may be corrupted, plain text, or produced by an incompatible library version."
            ) from pickle_exc

try:
    model = _load_model(MODEL_PATH)
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
                "Ensure scikit-learn version matches the training environment."
            )
        raise HTTPException(status_code=500, detail=detail)

    row = data.model_dump()
    row["is_allergy"] = int(bool(row["is_allergy"]))
    features = pd.DataFrame([[row[name] for name in _FEATURES]], columns=_FEATURES)

    raw_prediction = model.predict(features)[0]
    if isinstance(raw_prediction, str):
        normalized = raw_prediction.strip().lower()
        if normalized in {"comfortable", "comfort", "1"}:
            prediction = 1
            label = "Comfortable"
        elif normalized in {"uncomfortable", "discomfort", "0"}:
            prediction = 0
            label = "Uncomfortable"
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected model output: {raw_prediction!r}",
            )
    else:
        prediction = int(raw_prediction)
        if prediction not in {0, 1}:
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected model output: {raw_prediction!r}",
            )
        label = "Comfortable" if prediction == 1 else "Uncomfortable"

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

