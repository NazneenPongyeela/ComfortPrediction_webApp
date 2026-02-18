# Comfort Prediction Backend

## Predict API Example

```json
{
  "hospital_number": "<HN>",
  "windSpeed": <float>,
  "temperature": <float>,
  "humidity": <float>,
  "is_allergy": <bool|0|1>,
  "skintemp": <float>,
  "bmi": <float>,
  "eda_signal": [<float>, <float>, "..."],
  "eda_sampling_rate": <int>,
  "rr_intervals_ms": [<float>, <float>, "..."]
}
```

**cURL**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_number": "<HN>",
    "windSpeed": 0.6,
    "temperature": 26.5,
    "humidity": 55.2,
    "is_allergy": false,
    "skintemp": 33.1,
    "bmi": 21.3,
    "eda_signal": [0.12, 0.13, 0.11, "..."],
    "eda_sampling_rate": 4,
    "rr_intervals_ms": [810, 795, 805, "..."]
  }'
```

# Comfort Prediction System

This project consists of a frontend application built with React and Vite, and a backend service built with FastAPI.  
The system is designed for comfort prediction and patient data management.

## Project Structure

- Frontend: `src/`
- Backend: `Backend/app/`

## System Integration Guide

Please refer to the following document for backend–frontend integration, including login, prediction, patient management, and logout:

- [docs/deployment-guide.md](docs/deployment-guide.md)


## Frontend Setup (แก้ปัญหา Firebase import หาไม่เจอ)

หากรันแล้วเจอ error ลักษณะ `Failed to resolve import "firebase/auth"` หมายถึงแพ็กเกจ Firebase
ยังไม่ได้ติดตั้งในเครื่อง (Vite หาโมดูลไม่เจอ) ให้ติดตั้ง dependencies ใหม่ดังนี้:

```bash
cd Frontend
npm install
```

ถ้ายังไม่หาย ให้ลบโฟลเดอร์ `node_modules` แล้วติดตั้งใหม่:

```bash
rm -rf node_modules
npm install
```

> หมายเหตุ: โปรเจกต์นี้ใช้ Firebase SDK แบบ modular (`firebase/app`, `firebase/auth`)
> จึงต้องมีแพ็กเกจ `firebase` ใน `node_modules` เสมอ
