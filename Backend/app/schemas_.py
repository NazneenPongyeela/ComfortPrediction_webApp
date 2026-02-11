from pydantic import BaseModel, Field
from typing import Optional, Literal, Union

class PredictionInput(BaseModel):
    hospital_number: str
    windSpeed: float
    temperature: float
    humidity: float
    is_allergy: Union[bool, int]
    skintemp: float
    bmi: float
    eda_tonic_b: float
    eda_phasic_b: float
    hf_n_ecg_b: float
    lf_n_ecg_b: float
    lfhf_ratio_ecg_b: float

Gender = Literal["male", "female"]

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