# SUNDAE Frontend Demo Guide

## บัญชีทดสอบ (Mock Accounts)

### 1. Admin
- **Email:** `admin@sundae.demo`
- **Password:** (ใส่อะไรก็ได้)
- **Role:** `admin`
- **สิทธิ์:** เห็นทุกเมนู (Dashboard, Knowledge Base, Bots, Inbox, Integration, Approvals, Web Chat)
- **หน้าที่:** จัดการทั้งระบบ อนุมัติผู้ใช้ สร้าง/แก้ไข Bot อัปโหลดเอกสาร ดูสถิติ

### 2. Support
- **Email:** `support@sundae.demo`
- **Password:** (ใส่อะไรก็ได้)
- **Role:** `support`
- **สิทธิ์:** เห็น Approvals, Web Chat
- **หน้าที่:** อนุมัติผู้ใช้ใหม่ และทดสอบ/ใช้งาน Web Chat

### 3. User (ทั่วไป)
- **Email:** `prasit@example.com`
- **Password:** (ใส่อะไรก็ได้)
- **Role:** `user`
- **สิทธิ์:** เห็นเฉพาะ Web Chat
- **หน้าที่:** พูดคุยกับ Bot ผ่านหน้าเว็บ

### 4. Pending (รออนุมัติ)
- **Email:** `somchai@example.com` หรือ `somying@example.com`
- **Password:** (ใส่อะไรก็ได้)
- **Role:** `user`
- **สถานะ:** ยังไม่อนุมัติ → แสดงหน้า “รอการอนุมัติ” ไม่มีเมนูด้านข้าง

---

## Flow การทำงานของ UI (ตาม Role)

### 🔧 Admin Flow
1. **Login** → Dashboard (เห็นสถิติทั้งหมด)
2. **Approvals** → อนุมัติผู้ใช้ใหม่ (somchai, somying)
3. **Knowledge Base** → อัปโหลด/ลบ/ลิงก์เอกสารกับ Bot
4. **Bots** → สร้าง Bot ใหม่ / แก้ไข System Prompt / เปิด-ปิด Web Chat
5. **Inbox** → ดู/ตอบข้อความลูกค้า (จาก Web Chat หรือ LINE)
6. **Integration** → ตั้งค่าช่องทาง (LINE, Web)
7. **Web Chat** → ทดสอบพูดคุยกับ Bot ในมุมมองผู้ใช้ทั่วไป

### 🛠️ Support Flow
1. **Login** → Approvals
2. **Approvals** → อนุมัติผู้ใช้ใหม่ (เหมือน Admin)
3. **Web Chat** → ทดสอบพูดคุยกับ Bot

### 👤 User Flow
1. **Login** → ไปหน้า Web Chat โดยตรง
2. **เลือก Bot** → HR Assistant / IT Support / Finance FAQ
3. **พูดคุย** → ถามเรื่องสวัสดิการ, การลา, VPN, เบิกค่าใช้จ่าย
4. **ขอความช่วยเหลือ** → กดปุ่ม “ขอพูดกับเจ้าหน้าที่” → ข้อความจะไป Inbox
5. **รอ Support ตอบ** → ในหน้าเดิวจะเห็นข้อความจาก Support

---

## ฟีเจอร์ที่ทำงานแล้ว (Prototype)

### ✅ Auth & Navigation
- Login ด้วยอีเมลใด ๆ ก็ได้ (mock)
- Role-based navigation (admin/support/user)
- หน้า “รออนุมัติ” สำหรับ pending user

### ✅ Dashboard
- แสดงจำนวน Bot, Documents, Sessions, Users
- กราฟและสถิติที่จำลองขึ้น
- แจ้งเตือนจำนวนผู้รออนุมัติ (support/admin)

### ✅ Approvals
- รายชื่อผู้ใช้รออนุมัติ
- ปุ่ม Approve → ย้ายไปเป็น approved user
- แสดงผู้ใช้ที่อนุมัติแล้ว

### ✅ Knowledge Base
- อัปโหลดไฟล์ PDF (จำลอง)
- แสดงรายการเอกสาร + สถานะ (ready/processing)
- ลิงก์เอกสารกับ Bot ได้
- ลบเอกสาร

### ✅ Bots
- สร้าง Bot ใหม่ (ชื่อ, คำอธิบาย, System Prompt, เปิด Web Chat)
- แก้ไข Bot ที่มีอยู่
- ลบ Bot
- แสดงรายการ Bot พร้อมสถานะ

### ✅ Inbox (Support/Admin)
- รายการ session ที่มีคนถาม
- ดูประวัติการสนทนา
- ตอบข้อความในชื่อ Support
- อัปเดตสถานะ session (active/helped)

### ✅ Web Chat (ทุก role)
- เลือก Bot ที่จะพูดด้วย
- พิมพ์ข้อความและรับคำตอบแบบ streaming
- แสดง sources (เอกสารที่เกี่ยวข้อง)
- ปุ่ม “ขอพูดกับเจ้าหน้าที่”
- แสดงประวัติการสนทนา

### ✅ Integration
- ตั้งค่าช่องทาง (mock UI)
- แสดง LINE Token และ Web settings

---

## ข้อควรทราบ

- **ไม่ต้องใช้รหัสผ่านจริง** → ใส่อะไรก็ login ผ่าน
- **ข้อมูล persist ใน localStorage** → รีเฟรชแล้วยังอยู่ (ยกเว้น logout)
- **Mock data จำลองจากจริง** → มีข้อความเป็นไทย/อังกฤษ
- **ทุกปุ่ม/ฟีเจอร์ทำงาน** → ไม่มีปุ่มไหน “ไม่ตอบสนอง”

---

## วิธีเริ่มต้น Demo

1. เปิด Terminal ที่โฟลเดอร์ `frontend`
2. `npm install` (ครั้งแรก)
3. `npm run dev`
4. เปิดเบราว์เซอร์ → http://localhost:5173
5. Login ด้วยบัญชีที่ต้องการทดสอบ (ดูรายการด้านบน)

---

## ตัวอย่าง Flow ทดสอบฉบับย่อ

### ทดสอบ Admin
```
Login: admin@sundae.demo
→ Dashboard → Approvals (อนุมัติ somchai)
→ Bots (สร้าง Bot ใหม่)
→ Knowledge Base (อัปโหลด PDF)
→ Inbox (ตอบข้อความ)
→ Web Chat (ทดสอบพูดกับ Bot)
```

### ทดสอบ Support
```
Login: support@sundae.demo
→ Approvals (อนุมัติ somying)
→ Inbox (ตอบข้อความ)
→ Web Chat (ทดสอบ)
```

### ทดสอบ User
```
Login: prasit@example.com
→ Web Chat (พูดกับ HR Assistant)
→ ถามเรื่อง “วันลาพักผ่อน”
→ กด “ขอพูดกับเจ้าหน้าที่”
→ สลับไป login เป็น support → ตอบข้อความนั้น
```

---

**พร้อมนำเสนอ!** 🎉
