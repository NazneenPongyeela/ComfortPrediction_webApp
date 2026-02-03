from pathlib import Path
import joblib
import numpy as np

# model = joblib.load(r"D:\Thermal_comfort\Comfort_prediction\Backend\model\rf_model.pkl")
BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "model" / "rf_model.pkl"

model = joblib.load(MODEL_PATH)

FEATURE_ORDER = [
    "skintemp",
    "bmi",
    "is_allergy",
    "eda_tonic",
    "eda_phasic",
    "lf",
    "hf",
    "lfhf_ratio",
    "wind_speed",
    "temperature",
    "humidity"
]

PREDICTION_LABELS = {
    0: "Uncomfortable",
    1: "Comfortable",
}

def predict(features: dict) -> int:
    X = np.array([[features[f] for f in FEATURE_ORDER]])
    y_pred = model.predict(X)[0]

    return int(y_pred)

def format_prediction(prediction: int) -> str:
    return PREDICTION_LABELS.get(prediction, str(prediction))