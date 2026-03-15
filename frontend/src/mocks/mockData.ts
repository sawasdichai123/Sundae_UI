/**
 * SUNDAE Frontend — Mock Data for Prototype Mode
 *
 * Contains all mock data used when running without a backend.
 * Every entity uses realistic Thai/English content.
 */

import type {
    Bot,
    Document,
    UserProfile,
    Organization,
    ChatSession,
    ChatMessage,
} from "../types";

// ── Identity ────────────────────────────────────────────────────

export const MOCK_ORG: Organization = {
    id: "org-001-mock",
    name: "SUNDAE Demo Organization",
    created_at: "2025-01-15T09:00:00Z",
};

export const MOCK_USER: UserProfile = {
    id: "user-admin-001",
    organization_id: MOCK_ORG.id,
    email: "admin@sundae.demo",
    full_name: "Demo Admin",
    role: "admin",
    is_approved: true,
    created_at: "2025-01-15T09:00:00Z",
};

export const MOCK_SESSION = {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: "bearer" as const,
    user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {},
        user_metadata: { full_name: MOCK_USER.full_name },
        created_at: MOCK_USER.created_at,
    },
};

// ── Bots ────────────────────────────────────────────────────────

export const MOCK_BOTS: Bot[] = [
    {
        id: "bot-001-hr",
        organization_id: MOCK_ORG.id,
        name: "HR Assistant",
        description: "ผู้ช่วย AI สำหรับตอบคำถามด้านทรัพยากรบุคคล เช่น สวัสดิการ การลาหยุด ระเบียบข้อบังคับ",
        system_prompt: "คุณคือผู้ช่วย AI ด้าน HR ของบริษัท ตอบคำถามเกี่ยวกับสวัสดิการ การลาหยุด และระเบียบข้อบังคับ",
        is_active: true,
        is_web_enabled: true,
        created_at: "2025-02-01T10:00:00Z",
        updated_at: "2025-03-01T14:00:00Z",
    },
    {
        id: "bot-002-it",
        organization_id: MOCK_ORG.id,
        name: "IT Support Bot",
        description: "ผู้ช่วยแก้ปัญหาด้านเทคนิค เช่น การเชื่อมต่อ VPN, รีเซ็ตรหัสผ่าน, การตั้งค่าอีเมล",
        system_prompt: "คุณคือผู้ช่วย IT Support ตอบคำถามเกี่ยวกับเทคนิคและระบบสารสนเทศ",
        is_active: true,
        is_web_enabled: true,
        created_at: "2025-02-10T08:00:00Z",
        updated_at: "2025-03-05T11:00:00Z",
    },
    {
        id: "bot-003-finance",
        organization_id: MOCK_ORG.id,
        name: "Finance FAQ",
        description: "ตอบคำถามเกี่ยวกับการเบิกค่าใช้จ่าย งบประมาณ และระเบียบการเงิน",
        system_prompt: "คุณคือผู้ช่วยด้านการเงิน ตอบคำถามเกี่ยวกับการเบิกจ่ายและระเบียบการเงิน",
        is_active: false,
        is_web_enabled: false,
        created_at: "2025-02-20T12:00:00Z",
        updated_at: "2025-02-20T12:00:00Z",
    },
];

// ── Documents ───────────────────────────────────────────────────

export const MOCK_DOCUMENTS: Document[] = [
    {
        id: "doc-001",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001-hr",
        name: "คู่มือสวัสดิการพนักงาน 2025.pdf",
        file_path: "/uploads/doc-001.pdf",
        file_size_bytes: 2_450_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2025-02-05T10:30:00Z",
    },
    {
        id: "doc-002",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001-hr",
        name: "ระเบียบการลาหยุดพักผ่อน.pdf",
        file_path: "/uploads/doc-002.pdf",
        file_size_bytes: 1_200_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2025-02-10T14:00:00Z",
    },
    {
        id: "doc-003",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002-it",
        name: "IT Security Policy v3.1.pdf",
        file_path: "/uploads/doc-003.pdf",
        file_size_bytes: 3_100_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2025-02-15T09:00:00Z",
    },
    {
        id: "doc-004",
        organization_id: MOCK_ORG.id,
        bot_id: null,
        name: "แนวทางการเบิกค่าใช้จ่าย.pdf",
        file_path: "/uploads/doc-004.pdf",
        file_size_bytes: 890_000,
        mime_type: "application/pdf",
        status: "processing",
        created_at: new Date(Date.now() - 600_000).toISOString(),
    },
];

// ── Chat Sessions ───────────────────────────────────────────────

export const MOCK_SESSIONS: ChatSession[] = [
    {
        id: "session-001",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001-hr",
        platform_user_id: "web-user-A",
        platform_source: "web",
        status: "active",
        started_at: new Date(Date.now() - 3_600_000).toISOString(),
        last_message_at: new Date(Date.now() - 300_000).toISOString(),
    },
    {
        id: "session-002",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001-hr",
        platform_user_id: "line-user-B",
        platform_source: "line",
        status: "active",
        started_at: new Date(Date.now() - 7_200_000).toISOString(),
        last_message_at: new Date(Date.now() - 120_000).toISOString(),
    },
    {
        id: "session-003",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002-it",
        platform_user_id: "web-user-C",
        platform_source: "web",
        status: "helped",
        started_at: new Date(Date.now() - 86_400_000).toISOString(),
        last_message_at: new Date(Date.now() - 43_200_000).toISOString(),
    },
    {
        id: "session-004",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001-hr",
        platform_user_id: "web-user-D",
        platform_source: "web",
        status: "active",
        started_at: new Date(Date.now() - 172_800_000).toISOString(),
        last_message_at: new Date(Date.now() - 86_400_000).toISOString(),
    },
    {
        id: "session-005",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002-it",
        platform_user_id: "line-user-E",
        platform_source: "line",
        status: "active",
        started_at: new Date(Date.now() - 1_800_000).toISOString(),
        last_message_at: new Date(Date.now() - 60_000).toISOString(),
    },
];

// ── Chat Messages (keyed by session_id) ─────────────────────────

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    "session-001": [
        {
            id: "msg-001-1",
            session_id: "session-001",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "สวัสดีครับ อยากสอบถามเรื่องวันลาพักผ่อนประจำปี",
            metadata: {},
            created_at: new Date(Date.now() - 3_500_000).toISOString(),
        },
        {
            id: "msg-001-2",
            session_id: "session-001",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "สวัสดีค่ะ! ยินดีตอบคำถามค่ะ 😊\n\nตามระเบียบบริษัท พนักงานมีสิทธิ์ลาพักผ่อนประจำปีดังนี้:\n\n• อายุงาน 1-3 ปี: 6 วัน/ปี\n• อายุงาน 3-5 ปี: 10 วัน/ปี\n• อายุงานมากกว่า 5 ปี: 15 วัน/ปี\n\nวันลาที่ไม่ได้ใช้สามารถสะสมได้ไม่เกิน 5 วัน ต่อปีถัดไปค่ะ",
            metadata: {},
            created_at: new Date(Date.now() - 3_400_000).toISOString(),
        },
        {
            id: "msg-001-3",
            session_id: "session-001",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ถ้าจะลาติดต่อกันหลายวัน ต้องแจ้งล่วงหน้ากี่วันครับ?",
            metadata: {},
            created_at: new Date(Date.now() - 600_000).toISOString(),
        },
        {
            id: "msg-001-4",
            session_id: "session-001",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "ตามระเบียบค่ะ:\n\n• ลา 1-2 วัน: แจ้งล่วงหน้าอย่างน้อย 3 วันทำการ\n• ลา 3-5 วัน: แจ้งล่วงหน้าอย่างน้อย 7 วันทำการ\n• ลามากกว่า 5 วัน: แจ้งล่วงหน้าอย่างน้อย 14 วันทำการ\n\nต้องได้รับอนุมัติจากหัวหน้างานโดยตรงก่อนนะคะ",
            metadata: {},
            created_at: new Date(Date.now() - 300_000).toISOString(),
        },
    ],
    "session-002": [
        {
            id: "msg-002-1",
            session_id: "session-002",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "สอบถามเรื่องการเบิกค่ารักษาพยาบาลครับ",
            metadata: {},
            created_at: new Date(Date.now() - 7_000_000).toISOString(),
        },
        {
            id: "msg-002-2",
            session_id: "session-002",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "สวัสดีค่ะ! สำหรับการเบิกค่ารักษาพยาบาล พนักงานสามารถเบิกได้ตามวงเงินที่กำหนด:\n\n• ผู้ป่วยนอก (OPD): ไม่เกิน 3,000 บาท/ครั้ง\n• ผู้ป่วยใน (IPD): ไม่เกิน 50,000 บาท/ครั้ง\n\nต้องใช้ใบเสร็จรับเงินตัวจริงจากสถานพยาบาลค่ะ",
            metadata: {},
            created_at: new Date(Date.now() - 6_800_000).toISOString(),
        },
        {
            id: "msg-002-3",
            session_id: "session-002",
            organization_id: MOCK_ORG.id,
            role: "system",
            content: "ผู้ใช้ขอพูดคุยกับเจ้าหน้าที่",
            metadata: {},
            created_at: new Date(Date.now() - 300_000).toISOString(),
        },
        {
            id: "msg-002-4",
            session_id: "session-002",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ผมส่งใบเสร็จไปแล้ว 2 สัปดาห์ แต่ยังไม่ได้เงินคืนเลยครับ ช่วยตรวจสอบให้หน่อย",
            metadata: {},
            created_at: new Date(Date.now() - 120_000).toISOString(),
        },
    ],
    "session-003": [
        {
            id: "msg-003-1",
            session_id: "session-003",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "VPN เชื่อมต่อไม่ได้ครับ ขึ้น error connection timeout",
            metadata: {},
            created_at: new Date(Date.now() - 86_000_000).toISOString(),
        },
        {
            id: "msg-003-2",
            session_id: "session-003",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "ลองทำตามขั้นตอนนี้ดูนะคะ:\n\n1. ปิด VPN client แล้วเปิดใหม่\n2. ตรวจสอบการเชื่อมต่อ Internet ว่าปกติ\n3. ลอง ping gateway: `ping 10.0.0.1`\n4. หากยังไม่ได้ ให้ลบ VPN profile แล้วสร้างใหม่\n\nหากยังไม่หาย สามารถขอพูดคุยกับเจ้าหน้าที่ IT ได้เลยค่ะ",
            metadata: {},
            created_at: new Date(Date.now() - 85_000_000).toISOString(),
        },
        {
            id: "msg-003-3",
            session_id: "session-003",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ลองแล้วได้แล้วครับ ขอบคุณมากครับ!",
            metadata: {},
            created_at: new Date(Date.now() - 43_200_000).toISOString(),
        },
    ],
    "session-004": [
        {
            id: "msg-004-1",
            session_id: "session-004",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ขอสอบถามเรื่องโบนัสประจำปีครับ",
            metadata: {},
            created_at: new Date(Date.now() - 172_000_000).toISOString(),
        },
        {
            id: "msg-004-2",
            session_id: "session-004",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "เรื่องโบนัสประจำปีจะประกาศอย่างเป็นทางการในเดือนธันวาคมของทุกปีค่ะ โดยจะขึ้นอยู่กับผลประกอบการของบริษัทและผลการประเมินรายบุคคล สามารถติดตามประกาศได้ทาง Intranet ค่ะ",
            metadata: {},
            created_at: new Date(Date.now() - 171_000_000).toISOString(),
        },
    ],
    "session-005": [
        {
            id: "msg-005-1",
            session_id: "session-005",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "อีเมลบริษัทเข้าไม่ได้ครับ",
            metadata: {},
            created_at: new Date(Date.now() - 1_500_000).toISOString(),
        },
        {
            id: "msg-005-2",
            session_id: "session-005",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "ลองตรวจสอบตามนี้ค่ะ:\n\n1. เข้า https://mail.company.co.th\n2. ใช้ username: ชื่อ.นามสกุล@company.co.th\n3. หากลืมรหัสผ่าน กด \"Forgot Password\"\n4. ระบบจะส่ง OTP ไปที่เบอร์โทรศัพท์ที่ลงทะเบียนไว้\n\nหากยังเข้าไม่ได้ อาจเป็นเพราะ account ถูก lock กรุณาติดต่อ IT Helpdesk ค่ะ",
            metadata: {},
            created_at: new Date(Date.now() - 1_200_000).toISOString(),
        },
        {
            id: "msg-005-3",
            session_id: "session-005",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ลองกด Forgot Password แล้วแต่ไม่ได้รับ OTP เลยครับ",
            metadata: {},
            created_at: new Date(Date.now() - 60_000).toISOString(),
        },
    ],
};

// ── Pending / Approved Users (for ApprovalsPage) ────────────────

export const MOCK_PENDING_USERS: UserProfile[] = [
    {
        id: "user-pending-001",
        organization_id: MOCK_ORG.id,
        email: "somchai@example.com",
        full_name: "สมชาย ใจดี",
        role: "user",
        is_approved: false,
        created_at: new Date(Date.now() - 86_400_000).toISOString(),
    },
    {
        id: "user-pending-002",
        organization_id: MOCK_ORG.id,
        email: "somying@example.com",
        full_name: "สมหญิง รักเรียน",
        role: "user",
        is_approved: false,
        created_at: new Date(Date.now() - 172_800_000).toISOString(),
    },
];

export const MOCK_APPROVED_USERS: UserProfile[] = [
    {
        id: "user-approved-001",
        organization_id: MOCK_ORG.id,
        email: "admin@sundae.demo",
        full_name: "Demo Admin",
        role: "admin",
        is_approved: true,
        created_at: "2025-01-15T09:00:00Z",
    },
    {
        id: "user-approved-002",
        organization_id: MOCK_ORG.id,
        email: "support@sundae.demo",
        full_name: "Support Agent",
        role: "support",
        is_approved: true,
        created_at: "2025-01-20T10:00:00Z",
    },
    {
        id: "user-approved-003",
        organization_id: MOCK_ORG.id,
        email: "prasit@example.com",
        full_name: "ประสิทธิ์ ทำงานดี",
        role: "user",
        is_approved: true,
        created_at: "2025-02-01T08:00:00Z",
    },
];

// ── Mock AI Responses for Chat Stream ───────────────────────────

export const MOCK_AI_RESPONSES: Record<string, string> = {
    default:
        "ขอบคุณสำหรับคำถามค่ะ! 😊\n\nจากเอกสารที่มีในระบบ ขอตอบดังนี้:\n\nข้อมูลที่ท่านสอบถามอยู่ในหมวดระเบียบข้อบังคับของบริษัท สามารถดูรายละเอียดเพิ่มเติมได้ที่เอกสาร \"คู่มือพนักงาน\" หน้า 15-20\n\nหากมีคำถามเพิ่มเติม สามารถถามได้เลยค่ะ หรือหากต้องการพูดคุยกับเจ้าหน้าที่ สามารถกดปุ่ม \"ขอพูดคุยกับเจ้าหน้าที่\" ด้านล่างได้ค่ะ",
    leave: "ตามระเบียบการลาหยุดของบริษัท:\n\n📋 **ลาป่วย**: ลาได้ไม่เกิน 30 วัน/ปี (มีใบรับรองแพทย์)\n🏖️ **ลาพักผ่อน**: 6-15 วัน/ปี ตามอายุงาน\n📝 **ลากิจ**: ไม่เกิน 3 วัน/ปี โดยได้รับค่าจ้าง\n\nการลาทุกประเภทต้องยื่นผ่านระบบ HR Portal และได้รับอนุมัติจากหัวหน้างานก่อนค่ะ",
    benefit: "สวัสดิการพนักงานประกอบด้วย:\n\n🏥 **ประกันสุขภาพกลุ่ม**: คุ้มครองทั้ง OPD และ IPD\n💰 **กองทุนสำรองเลี้ยงชีพ**: บริษัทสมทบ 5%\n🚗 **ค่าเดินทาง**: 3,000 บาท/เดือน\n📱 **ค่าโทรศัพท์**: 1,000 บาท/เดือน\n🎓 **ทุนการศึกษา**: สนับสนุนการเรียนต่อ\n\nดูรายละเอียดเพิ่มเติมในคู่มือสวัสดิการพนักงาน 2025 ค่ะ",
    expense: "ขั้นตอนการเบิกค่าใช้จ่าย:\n\n1️⃣ กรอกแบบฟอร์มเบิกค่าใช้จ่ายในระบบ ERP\n2️⃣ แนบใบเสร็จรับเงินตัวจริง\n3️⃣ ส่งให้หัวหน้างานอนุมัติ\n4️⃣ ส่งต่อฝ่ายการเงินตรวจสอบ\n5️⃣ เงินจะโอนเข้าบัญชีภายใน 5-7 วันทำการ\n\n⚠️ ต้องยื่นเบิกภายใน 30 วันนับจากวันที่เกิดค่าใช้จ่ายค่ะ",
};

// ── Session-based user names for Inbox display ──────────────────

export const MOCK_SESSION_USER_NAMES: Record<string, string> = {
    "session-001": "คุณสมชาย",
    "session-002": "คุณวิภา (LINE)",
    "session-003": "คุณประสิทธิ์",
    "session-004": "คุณนภา",
    "session-005": "คุณอรรถพล (LINE)",
};
