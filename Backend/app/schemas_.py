from pydantic import BaseModel

class PredictionInput(BaseModel):
    hospital_number: str
    skintemp: float
    bmi: float
    eda_raw: float          # raw EDA
    hrv_raw: float          # raw HRV
    is_allergy: int
