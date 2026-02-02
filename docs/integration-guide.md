# Backend ↔ Frontend Integration Guide (Login, Prediction, Patient CRUD, Logout)

This guide explains how to connect the frontend (React) with the backend (FastAPI) in a structured way based on the current project setup and existing endpoints. It also covers how to replace mocked frontend functionality with real API calls.

## 1) Prediction request payload
The backend exposes `POST /predict` and expects the following `PredictionInput` fields:

- `hospital_number`: string
- `skintemp`: float
- `bmi`: float
- `eda_raw`: float
- `hrv_raw`: float
- `is_allergy`: int

After submission, the backend processes the data and stores the prediction in Firebase before returning the result to the frontend.

## 2) Configure the backend base URL in the frontend
Use a Vite env variable so you can easily switch between dev/prod environments.

Example `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

Access it through `import.meta.env.VITE_API_BASE_URL` to build a shared API client.

## 3) Login (Frontend → Firebase Auth) and sending tokens to the backend
The backend uses `verify_token` with `Depends`, which means you must send a token with authenticated requests.

Recommended flow (if using Firebase Auth):

1. After login, get the Firebase ID token:
   ```js
   const token = await user.getIdToken();
   localStorage.setItem("idToken", token);
   ```

2. Attach the token on every backend request:
   ```js
   Authorization: `Bearer ${token}`
   ```

3. On the backend, verify the token in `verify_token` and return a `user` object for endpoints like `/predict`.

> If you do not have `verify_token` yet, implement it using `firebase_admin.auth.verify_id_token` to match Firebase Auth usage on the frontend.

## 4) Connect the Prediction page to the real backend
The current `PredictionPage` is mocked. Replace the submit handler with a real API call:

Example `POST /predict`:
```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("idToken");

const response = await fetch(`${baseUrl}/predict`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    hospital_number,
    skintemp,
    bmi,
    eda_raw,
    hrv_raw,
    is_allergy,
  }),
});

const result = await response.json();
setPrediction(result.prediction);
```

## 5) Patient management (create/update/delete)
The frontend includes `PatientManagementPage` and an add-patient dialog, but it is still mocked.

Add these backend endpoints if they do not exist yet:

- `GET /patients` → ดึงรายชื่อทั้งหมด
- `POST /patients` → เพิ่มข้อมูลผู้ป่วย
- `PUT /patients/{id}` → แก้ไขข้อมูลผู้ป่วย
- `DELETE /patients/{id}` → ลบข้อมูลผู้ป่วย

Example frontend usage:

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("idToken");

// GET
const patients = await fetch(`${baseUrl}/patients`, {
  headers: { Authorization: `Bearer ${token}` },
}).then((res) => res.json());

// POST
await fetch(`${baseUrl}/patients`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(newPatient),
});

// PUT
await fetch(`${baseUrl}/patients/${patientId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(updatedPatient),
});

// DELETE
await fetch(`${baseUrl}/patients/${patientId}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
```

## 6) Logout
In `DashboardLayout` there is a comment “Handle logout logic.” Implement it like this:

1. If you use Firebase Auth, call `signOut(auth)`
2. Remove the token from `localStorage`
3. Redirect to `/login`

Example:
```js
import { signOut } from "firebase/auth";

await signOut(auth);
localStorage.removeItem("idToken");
navigate("/login");
```

## 7) CORS configuration
If the frontend hits CORS errors, enable CORS in FastAPI:

```py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 8) Recommended checklist
1. Set `VITE_API_BASE_URL`
2. Implement login on the frontend to obtain a token
3. Send the token with every backend request
4. Wire `/predict` to use real measurements
5. Add patient APIs and connect them to `PatientManagementPage`
6. Implement logout to clear the token and redirect

With these steps, you can connect login, prediction, and patient management end-to-end and expand later as needed.
