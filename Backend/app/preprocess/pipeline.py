from preprocess.eda import preprocess_eda
from preprocess.hrv import preprocess_hrv


def preprocess_features(raw: dict) -> dict:
    eda_features = preprocess_eda(raw["eda_raw"])
    hrv_features = preprocess_hrv(raw["hrv_raw"])

    return {
        "skintemp": raw["skintemp"],
        "bmi": raw["bmi"],
        "is_allergy": raw["is_allergy"],
        **eda_features,
        **hrv_features
    }
