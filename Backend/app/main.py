from fastapi import FastAPI
from schemas_ import PredictionInput
from preprocess.pipeline import preprocess_features
from model_loader import predict
from firebase import save_result

app = FastAPI()

@app.post("/predict")
def predict_signal(data: PredictionInput):
    raw_data = data.dict()

    processed = preprocess_features(raw_data)
    prediction = predict(processed)

    save_result(
        hospital_number=raw_data["hospital_number"],
        raw_data=raw_data,
        processed_data=processed,
        prediction=prediction
    )

    return {
        "hospital_number": raw_data["hospital_number"],
        "prediction": prediction,
        "processed_features": processed
    }
