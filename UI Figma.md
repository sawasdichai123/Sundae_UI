# UI → Figma (Prototype Map)

ไฟล์ในโฟลเดอร์ `figma/` ถูกทำมาเพื่อให้คุณ **ลากเข้า Figma** หรือ **คัดลอก SVG markup ไปวาง** เพื่อทำ Prototype ได้เร็ว

## 1) ไฟล์ที่สร้างให้

- `figma/UI-Flow.svg`
  - แผนผังหน้าจอ (Screen Map) + เส้นลิ้งค์ (ลูกศร) ระหว่างหน้า
  - แยกกลุ่มตาม role: Public/Auth, Admin, Support, User

- `figma/screens/*.svg`
  - 1 ไฟล์ต่อ 1 หน้าจอ (เฟรม 1440×900) สำหรับลากเข้า Figma ทีละหน้า
  - รายการไฟล์:
    - `figma/screens/00-Login.svg`
    - `figma/screens/01-ForgotPassword.svg`
    - `figma/screens/02-ResetPassword.svg`
    - `figma/screens/10-Dashboard.svg`
    - `figma/screens/11-KnowledgeBase.svg`
    - `figma/screens/12-Bots.svg`
    - `figma/screens/13-Inbox.svg`
    - `figma/screens/14-Integration.svg`
    - `figma/screens/15-Approvals.svg`
    - `figma/screens/16-WebChat.svg`
    - `figma/screens/17-CreateOrg.svg`
    - `figma/screens/18-Organization.svg`

## 2) วิธีนำเข้า Figma

### วิธี A (แนะนำ): Import file
1. เปิด Figma file
2. ลากไฟล์ `figma/UI-Flow.svg` เข้า canvas ได้เลย
3. Ungroup ได้ตามต้องการ (Figma มักจะ group เป็นชั้น ๆ)

### วิธี A2: Import ทีละหน้า (แนะนำสำหรับ Prototype)
1. ลากไฟล์จาก `figma/screens/` เข้า Figma ทีละหน้า
2. Rename frame ตามชื่อหน้า
3. ไปที่แท็บ Prototype แล้วลาก interaction เชื่อมตาม flow

### วิธี B: Copy/Paste markup
1. เปิดไฟล์ `figma/UI-Flow.svg` ด้วย text editor
2. Copy ทั้งไฟล์ (ตั้งแต่ `<svg ...>` ถึง `</svg>`)
3. ไปที่ Figma แล้ว paste ลง canvas

## 3) ข้อจำกัด

- SVG นี้ **แสดงเส้นลิงก์เป็นภาพ** (visual links)
- แต่ **ไม่สามารถสร้าง interactive prototype links ของ Figma แบบคลิกแล้วไปหน้าอื่นได้โดยตรงจาก SVG**
  - คุณยังต้องทำการ set prototype connection ใน Figma เอง

## 4) รายชื่อหน้าจอใน Flow

### Public/Auth
- Login
- Forgot Password
- Reset Password

### App (หลัง login)
- Dashboard
- Knowledge Base
- Bots
- Inbox
- Integration
- Approvals
- Web Chat
- Create Org
- Organization

## 5) กติกาการนำทาง (ตาม role)

- Admin
  - `/` → Dashboard
  - เข้าได้ทุกหน้า
- Support
  - `/` → Approvals
  - เข้าได้เฉพาะ Approvals, Web Chat
- User
  - `/` → Web Chat
  - เข้าได้เฉพาะ Web Chat

---

หากคุณอยากให้ผมแยก SVG เป็นหลายไฟล์ (เช่น 1 ไฟล์ต่อ role/ต่อ flow) บอกได้เลย แล้วผมจะสร้างเพิ่มให้
