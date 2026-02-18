# Deployment Guide (Vercel Frontend + Render Backend)

คู่มือนี้สรุปการตั้งค่า environment และ config ที่จำเป็นเพื่อ deploy โปรเจกต์นี้ให้ใช้งานได้จริง

## 1) Deploy Backend บน Render

- Runtime: Python
- Root directory: `Backend`
- Build command:
  ```bash
  pip install -r requirements.txt
  ```
- Start command:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### Environment Variables (Render)
ตั้งค่าตามไฟล์ตัวอย่าง `Backend/.env.example`

- `FRONTEND_URLS`: รายชื่อ origin ที่อนุญาต (คั่นด้วย comma)
- `FRONTEND_URL`: origin เดี่ยว (รองรับ backward compatibility)
- `FRONTEND_ORIGIN_REGEX`: (ไม่บังคับ) สำหรับ Vercel preview domains
- `FIREBASE_CREDENTIALS_PATH`: path ไป service account json
- `DISABLE_FIREBASE`: ควรเป็น `0` ใน production

## 2) Deploy Frontend บน Vercel

- Framework preset: Vite
- Root directory: `Frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Environment Variables (Vercel)
ตั้งค่าตามไฟล์ตัวอย่าง `Frontend/.env.example`

- `VITE_API_BASE_URL`: URL ของ Render backend เช่น `https://your-service.onrender.com`
- Firebase Web SDK variables ทั้งหมด (`VITE_FIREBASE_*`)

## 3) CORS ที่รองรับ Vercel + custom domain

Backend จะอ่านค่าจาก env เพื่อเปิด CORS ให้โดเมน frontend:

- รองรับทั้ง `FRONTEND_URL` และ `FRONTEND_URLS`
- ตัด slash ท้ายอัตโนมัติ
- รองรับ regex ผ่าน `FRONTEND_ORIGIN_REGEX`

## 4) Post-deploy smoke checks

1. เปิดหน้าเว็บบน Vercel แล้ว login ได้
2. ยิง `GET /patients` ผ่าน frontend โดยไม่ติด CORS
3. ทดสอบ `POST /predict` แล้วได้ผลลัพธ์กลับมา
4. ตรวจ logs ของ Render ว่าไม่มี error เรื่อง Firebase credentials

## 5) หมายเหตุ

- อย่า commit secret ลง git (`.env`, service account json)
- ถ้าใช้ Vercel preview URL จำนวนมาก แนะนำใช้ `FRONTEND_ORIGIN_REGEX`
