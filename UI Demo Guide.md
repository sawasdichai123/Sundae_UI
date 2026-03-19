# SUNDAE Frontend Demo Guide

## บัญชีทดสอบ (Mock Accounts)

| # | Role | Email | Password | ชื่อ | สิทธิ์ |
|---|------|-------|----------|------|--------|
| 1 | **Admin** | `admin@sundae.local` | `demo` | ณัฐพล วงศ์สุวรรณ | เห็นทุกเมนู — จัดการทั้งระบบ |
| 2 | **Support** | `support@sundae.local` | `demo` | พิมพ์ใจ ศรีสุข | Approvals, Web Chat, Organization |
| 3 | **User (Member)** | `user@sundae.local` | `demo` | สมชาย ใจดี | Web Chat (ถูก redirect อัตโนมัติ) |
| 4 | **User (Owner)** | `owner@sundae.local` | `demo` | ธนกร เจริญธรรม | เห็น Dashboard, KB, Bots, Inbox, Integration, Organization (เหมือน Admin แต่ role เป็น user) |
| 5 | **Pending** | `pending@sundae.local` | `demo` | วิภาวี รักษ์ดี | ไม่มีเมนู — แสดงหน้า "รอการอนุมัติ" |
| 6 | **Approved (ไม่มี Org)** | `approved@sundae.local` | `demo` | ปิยะ วิชัยดิษฐ | อนุมัติแล้ว — แสดงหน้า "รอคำเชิญเข้าร่วมองค์กร" + มีคำเชิญให้กดรับ |

> **หมายเหตุ:** Password ใส่อะไรก็ได้ ระบบ mock ไม่ตรวจสอบรหัสผ่าน (แนะนำ: `demo`)

---

## Flow การทำงานของ UI (ตาม Role)

### 🔧 Admin Flow (เห็นทุกหน้า)
1. **Login** → Dashboard (เห็นสถิติ: เอกสาร 6 รายการ, Bot 3 ตัว, แชท 6 sessions, รอดูแล 2)
2. **Approvals** → อนุมัติผู้ใช้ใหม่ 3 คน (วิภาวี, สมชาย สมบูรณ์, สมหญิง)
3. **Knowledge Base** → จัดการเอกสาร 6 ไฟล์ (อัปโหลด/ลบ/ลิงก์กับ Bot)
4. **Bots** → จัดการ Bot 3 ตัว (HR Assistant, IT Support, Finance FAQ)
5. **Inbox** → ดู/ตอบ 6 sessions (มี 2 sessions รอเจ้าหน้าที่ตอบ)
6. **Integration** → ตั้งค่าช่องทาง LINE/Web
7. **Organization** → แก้ไขชื่อองค์กร, ดูสมาชิก 4 คน, เชิญ/ลบสมาชิก
8. **Web Chat** → ทดสอบถาม Bot (streaming response + source references)
9. **Profile** → ดูข้อมูลโปรไฟล์

### 🛠️ Support Flow (Approvals + Web Chat + Organization)
1. **Login** → Dashboard (เห็นจำนวนผู้รออนุมัติ + แชทรอดูแล)
2. **Approvals** → อนุมัติผู้ใช้ใหม่ 3 คน
3. **Web Chat** → ทดสอบพูดคุยกับ Bot
4. **Organization** → ดูข้อมูลองค์กร

### 👤 User Member Flow (Web Chat เท่านั้น)
1. **Login** → Redirect อัตโนมัติไปหน้า `/chat`
2. **เลือก Bot** → HR Assistant / IT Support
3. **พูดคุย** → ถามเรื่องสวัสดิการ, การลา, VPN, เบิกค่าใช้จ่าย
4. **ขอความช่วยเหลือ** → กดปุ่ม "ขอพูดกับเจ้าหน้าที่" → สถานะเป็น human_takeover
5. **รอ Support ตอบ** → ข้อความจาก Support จะปรากฏในหน้าเดิม

### 👑 User Owner Flow (เหมือน Admin แต่ role เป็น user)
1. **Login** → Dashboard (เห็นสถิติเหมือน Admin เพราะเป็น org owner)
2. **Knowledge Base** → จัดการเอกสาร
3. **Bots** → สร้าง/แก้ไข Bot
4. **Inbox** → ดู/ตอบข้อความลูกค้า
5. **Integration** → ตั้งค่าช่องทาง
6. **Organization** → จัดการองค์กร (เป็น Owner เห็น Danger Zone ได้)
7. **Web Chat** → ทดสอบพูดคุยกับ Bot

### ⏳ Pending Flow (รออนุมัติ)
1. **Login** → แสดงหน้า "บัญชีกำลังรอการอนุมัติ"
2. **ไม่มีเมนู Sidebar** → เห็นเฉพาะหน้า lockout + ปุ่ม logout
3. **Poll ทุก 10 วินาที** → ถ้า Admin อนุมัติแล้ว จะเข้าระบบได้ทันที

### ✅ Approved (ไม่มี Org) Flow
1. **Login** → Redirect ไปหน้า `/create-org`
2. **เห็น badge** "บัญชีได้รับการอนุมัติแล้ว" (สีเขียว)
3. **แสดง progress** ขั้นตอน: สมัคร ✓ → อนุมัติ ✓ → รอคำเชิญ ● → เข้าใช้งาน ○
4. **มีคำเชิญ** → กดปุ่ม "เข้าร่วม" → เข้าองค์กร SUNDAE Demo Org → Redirect ไปหน้าหลัก

---

## ข้อมูล Mock ที่พร้อมใช้งาน

### Bots (3 ตัว)
| Bot | คำอธิบาย | Web Chat |
|-----|---------|----------|
| **HR Assistant** | ตอบเรื่อง HR สวัสดิการ วันลา | เปิด |
| **IT Support** | ช่วย VPN อีเมล ระบบภายใน | เปิด |
| **Finance FAQ** | การเบิกค่าใช้จ่าย งบประมาณ | ปิด |

### เอกสาร (6 ไฟล์)
| เอกสาร | Bot ที่ลิงก์ | สถานะ |
|--------|------------|--------|
| คู่มือพนักงาน_2026.pdf | HR Assistant | ready |
| นโยบายวันลาและสวัสดิการ.pdf | HR Assistant | ready |
| IT_Security_Policy_v3.pdf | IT Support | ready |
| VPN_Setup_Guide.pdf | IT Support | ready |
| ระเบียบการเบิกค่าใช้จ่าย.pdf | Finance FAQ | ready |
| Company_Overview_2026.pdf | (ไม่ลิงก์) | processing |

### Chat Sessions (6 sessions)
| Session | Bot | สถานะ | Platform |
|---------|-----|--------|----------|
| สมชาย ใจดี | HR Assistant | active | Web |
| นฤมล งามตา | HR Assistant | active | Web |
| อาทิตย์ แสนดี | IT Support | **human_takeover** | Web |
| ปิยะนุช วงศ์ทอง | Finance FAQ | active | LINE |
| กิตติพงษ์ เจริญสุข | HR Assistant | helped | Web |
| วรรณา สุขสมบูรณ์ | IT Support | **human_takeover** | Web |

### AI Response Keywords
| คำถามที่พิมพ์ | Response ที่ได้ |
|--------------|---------------|
| ลา, หยุด, leave | นโยบายวันลา |
| สวัสดิการ, ประกัน, กองทุน | สวัสดิการบริษัท |
| เบิก, ค่าใช้จ่าย, ใบเสร็จ | ขั้นตอนการเบิก |
| VPN, อีเมล, ระบบ, เข้าไม่ได้ | แก้ปัญหา IT |
| อื่น ๆ | ข้อความทั่วไป |

---

## ฟีเจอร์ที่ทำงานแล้ว (Prototype)

### ✅ Auth & Navigation
- Login ด้วย email lookup (mock) — password ไม่ตรวจสอบ
- Role-based navigation (admin/support/user)
- Role-based home redirect: user → `/chat`, admin/support → Dashboard
- หน้า "รออนุมัติ" สำหรับ pending user + auto-poll ทุก 10 วินาที
- Register (จำลอง), Forgot Password, Reset Password

### ✅ Dashboard
- Metric cards: เอกสาร, Bot, แชทวันนี้, แชทรอดูแล
- Support เห็น "ผู้ใช้รออนุมัติ" แทนแชทวันนี้
- Quick Actions: ลิงก์ไป Knowledge Base / Bots / Inbox
- System Status indicators (จำลอง)
- Member Management: เชิญ/ลบสมาชิก (owner + admin)

### ✅ Approvals
- รายชื่อผู้ใช้รออนุมัติ (3 คน)
- ปุ่ม Approve/Reject → อัปเดต UI ทันที

### ✅ Knowledge Base
- แสดง 6 เอกสาร + สถานะ (ready/processing)
- อัปโหลดไฟล์ PDF (จำลอง)
- ลิงก์/ยกเลิกลิงก์เอกสารกับ Bot
- ลบเอกสาร

### ✅ Bots
- แสดง 3 Bot พร้อม description + system prompt
- สร้าง/แก้ไข/ลบ Bot
- Toggle active/web-enabled

### ✅ Inbox (Admin/Owner)
- แสดง 6 sessions พร้อมชื่อผู้ใช้และสถานะ
- ดูประวัติข้อความแต่ละ session
- ตอบข้อความในฐานะ admin/support
- อัปเดตสถานะ session

### ✅ Web Chat (ทุก role)
- เลือก Bot จาก dropdown
- Streaming response (จำลอง token-by-token)
- แสดง source references
- ปุ่ม "ขอพูดกับเจ้าหน้าที่" → human_takeover
- Session persistence (localStorage)

### ✅ Organization (Owner/Admin/Support)
- แก้ไขชื่อองค์กร
- ดูรายชื่อสมาชิก
- เชิญ/ลบสมาชิก
- ขอลบองค์กร (Danger Zone)

### ✅ Integration
- ตั้งค่าช่องทาง LINE/Web (mock UI)

### ✅ Profile
- แสดงข้อมูลโปรไฟล์ (ชื่อ, อีเมล, role)

---

## ข้อควรทราบ

- **ไม่ต้องใช้รหัสผ่านจริง** → ใส่อะไรก็ login ผ่าน
- **ข้อมูล persist ใน memory** → รีเฟรชแล้วยังอยู่ (ยกเว้น logout)
- **Mock data จำลองจากจริง** → มีข้อความเป็นไทย + อ้างอิงเอกสาร
- **ทุกปุ่ม/ฟีเจอร์ทำงาน** → ไม่มีปุ่มไหน "ไม่ตอบสนอง"
- **ไม่ต้องเชื่อมต่อ backend** → ทำงานได้ offline (mock ทั้งหมด)

---

## วิธีเริ่มต้น Demo

```bash
cd frontend
npm install    # ครั้งแรกเท่านั้น
npm run dev
```

เปิดเบราว์เซอร์ → http://localhost:5173

---

## ตัวอย่าง Flow ทดสอบฉบับย่อ

### ทดสอบ Admin (เห็นทุกอย่าง)
```
Login: admin@sundae.local / demo
→ Dashboard (ดูสถิติ + สมาชิกองค์กร)
→ Approvals (อนุมัติ สมชาย สมบูรณ์)
→ Bots (แก้ไข HR Assistant system prompt)
→ Knowledge Base (อัปโหลด PDF ใหม่ + ลิงก์กับ Bot)
→ Inbox (ตอบข้อความ session "อาทิตย์ แสนดี" ที่รอเจ้าหน้าที่)
→ Web Chat (ถาม "วันลาพักร้อนได้กี่วัน")
→ Organization (แก้ชื่อองค์กร, เชิญสมาชิกใหม่)
```

### ทดสอบ Support (จำกัดเมนู)
```
Login: support@sundae.local / demo
→ Dashboard (เห็นจำนวนผู้รออนุมัติ)
→ Approvals (อนุมัติ สมหญิง มีสุข)
→ Web Chat (ทดสอบถาม "สวัสดิการประกันสุขภาพ")
→ ลอง URL ตรง /bots, /knowledge-base → ถูก block
```

### ทดสอบ User (Web Chat only)
```
Login: user@sundae.local / demo
→ Redirect ไปหน้า Web Chat อัตโนมัติ
→ เลือก HR Assistant
→ ถาม "วันลาพักผ่อนปีนี้ได้กี่วัน"
→ ถาม "VPN เข้าไม่ได้"
→ กด "ขอพูดกับเจ้าหน้าที่"
→ สลับไป login เป็น admin → Inbox → ตอบข้อความนั้น
```

### ทดสอบ User Owner (เห็นทุกอย่างเหมือน Admin)
```
Login: owner@sundae.local / demo
→ Dashboard (เห็นสถิติ + badge "Owner")
→ Knowledge Base (อัปโหลด/จัดการเอกสาร)
→ Bots (สร้าง/แก้ไข Bot)
→ Inbox (ตอบข้อความลูกค้า)
→ Organization (จัดการองค์กร — เห็น Danger Zone เพราะเป็น Owner)
→ Web Chat (ทดสอบถาม Bot)
```

### ทดสอบ Pending (ถูก lockout)
```
Login: pending@sundae.local / demo
→ เห็นหน้า "บัญชีกำลังรอการอนุมัติ"
→ ไม่มีเมนู Sidebar
→ สลับไป login เป็น admin → Approvals → อนุมัติ วิภาวี
→ กลับมา login เป็น pending → เข้าระบบได้แล้ว
```

### ทดสอบ Approved ไม่มี Org (รอคำเชิญ)
```
Login: approved@sundae.local / demo
→ Redirect ไปหน้า /create-org
→ เห็น badge สีเขียว "บัญชีได้รับการอนุมัติแล้ว"
→ เห็นคำเชิญจาก "SUNDAE Demo Org"
→ กด "เข้าร่วม" → เข้าองค์กรสำเร็จ → Redirect ไปหน้าหลัก
```
