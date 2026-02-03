# Comfort Prediction System

This project consists of a frontend application built with React and Vite, and a backend service built with FastAPI.  
The system is designed for comfort prediction and patient data management.

## Project Structure

- Frontend: `src/`
- Backend: `Backend/app/`

## System Integration Guide

Please refer to the following document for backend–frontend integration, including login, prediction, patient management, and logout:

- [docs/integration-guide.md](docs/integration-guide.md)


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