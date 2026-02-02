from pydantic import BaseModel, Field
from typing import Optional, Literal

class PredictionInput(BaseModel):
    hospital_number: str
    skintemp: float
    bmi: float
    eda_raw: float          # raw EDA
    hrv_raw: float          # raw HRV
    windSpeed: float
    temperature: float
    humidity: float
    is_allergy: int

Gender = Literal["male", "female", "other"]

class PatientBase(BaseModel):
    hospital_number: str = Field(..., min_length=1, max_length=50)
    room: str = Field(..., min_length=1, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=200)
    age: int = Field(..., ge=0, le=120)
    height_cm: float = Field(..., gt=0, le=300)
    weight_kg: float = Field(..., gt=0, le=500)
    gender: Gender

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    hospital_number: Optional[str] = Field(None, min_length=1, max_length=50)
    room: Optional[str] = Field(None, min_length=1, max_length=50)
    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    age: Optional[int] = Field(None, ge=0, le=120)
    height_cm: Optional[float] = Field(None, gt=0, le=300)
    weight_kg: Optional[float] = Field(None, gt=0, le=500)
    gender: Optional[Gender] = None