import joblib
import numpy as np

model = joblib.load(r"D:\Thermal_comfort\Comfort_prediction\Backend\model\rf_model.pkl")

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

def predict(features: dict) -> int:
    X = np.array([[features[f] for f in FEATURE_ORDER]])
    y_pred = model.predict(X)[0]

    return int(y_pred)