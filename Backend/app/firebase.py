import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime


cred = credentials.Certificate(r"D:\Thermal_comfort\Comfort_prediction\Backend\app\data-1e66c-firebase-adminsdk-fbsvc-802167c552.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://data-1e66c-default-rtdb.asia-southeast1.firebasedatabase.app/"
})

def save_result(hospital_number, raw_data, processed_data, prediction):
    ref = db.reference(f"/Predictions/{hospital_number}")
    ref.set({
        "timestamp": datetime.utcnow().isoformat(),
        "raw_input": raw_data,
        "processed_features": processed_data,
        "prediction": prediction
    })
