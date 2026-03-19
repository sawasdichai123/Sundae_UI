import type { Bot, ChatMessage, ChatSession, Document, OrgInvitation, OrgMember, OrgMembership, Organization, UserProfile } from "../types";

export const PROTO_STORAGE_KEYS = {
    user: "sundae_proto_user",
    org: "sundae_proto_org",
} as const;

// ── Organization ─────────────────────────────────────────────────

export const MOCK_ORG: Organization = {
    id: "org-001",
    name: "SUNDAE Demo Org",
    created_at: "2026-01-15T08:00:00.000Z",
};

export const MOCK_ORG_MEMBERSHIPS: OrgMembership[] = [
    {
        id: "org-001",
        name: MOCK_ORG.name,
        slug: "sundae-demo",
        org_role: "owner",
        created_at: MOCK_ORG.created_at,
    },
];

// ── Users ────────────────────────────────────────────────────────

export const MOCK_APPROVED_USERS: UserProfile[] = [
    {
        id: "user-admin-001",
        organization_id: MOCK_ORG.id,
        email: "admin@sundae.local",
        full_name: "ณัฐพล วงศ์สุวรรณ",
        role: "admin",
        is_approved: true,
        created_at: "2026-01-15T08:00:00.000Z",
    },
    {
        id: "user-support-001",
        organization_id: MOCK_ORG.id,
        email: "support@sundae.local",
        full_name: "พิมพ์ใจ ศรีสุข",
        role: "support",
        is_approved: true,
        created_at: "2026-01-20T09:30:00.000Z",
    },
    {
        id: "user-user-001",
        organization_id: MOCK_ORG.id,
        email: "user@sundae.local",
        full_name: "สมชาย ใจดี",
        role: "user",
        is_approved: true,
        created_at: "2026-02-01T10:00:00.000Z",
    },
    {
        id: "user-owner-001",
        organization_id: MOCK_ORG.id,
        email: "owner@sundae.local",
        full_name: "ธนกร เจริญธรรม",
        role: "user",
        is_approved: true,
        created_at: "2026-01-16T09:00:00.000Z",
    },
    {
        id: "user-approved-001",
        organization_id: null,
        email: "approved@sundae.local",
        full_name: "ปิยะ วิชัยดิษฐ",
        role: "user",
        is_approved: true,
        created_at: "2026-03-19T10:00:00.000Z",
    },
];

export const MOCK_PENDING_USERS: UserProfile[] = [
    {
        id: "user-pending-001",
        organization_id: MOCK_ORG.id,
        email: "pending@sundae.local",
        full_name: "วิภาวี รักษ์ดี",
        role: "user",
        is_approved: false,
        created_at: "2026-03-18T14:00:00.000Z",
    },
    {
        id: "user-pending-002",
        organization_id: MOCK_ORG.id,
        email: "somchai.new@company.co.th",
        full_name: "สมชาย สมบูรณ์",
        role: "user",
        is_approved: false,
        created_at: "2026-03-19T09:15:00.000Z",
    },
    {
        id: "user-pending-003",
        organization_id: MOCK_ORG.id,
        email: "somying@company.co.th",
        full_name: "สมหญิง มีสุข",
        role: "user",
        is_approved: false,
        created_at: "2026-03-19T11:30:00.000Z",
    },
];

// ── Bots ─────────────────────────────────────────────────────────

export const MOCK_BOTS: Bot[] = [
    {
        id: "bot-001",
        organization_id: MOCK_ORG.id,
        name: "HR Assistant",
        description: "ตอบคำถามเกี่ยวกับฝ่ายบุคคล สวัสดิการ วันลา และระเบียบบริษัท",
        system_prompt: "คุณคือ HR Assistant ของบริษัท SUNDAE ตอบคำถามเกี่ยวกับสวัสดิการ วันลา และระเบียบบริษัทอย่างสุภาพและถูกต้อง",
        is_active: true,
        is_web_enabled: true,
        created_at: "2026-02-01T08:00:00.000Z",
        updated_at: "2026-03-15T10:00:00.000Z",
    },
    {
        id: "bot-002",
        organization_id: MOCK_ORG.id,
        name: "IT Support",
        description: "ช่วยเหลือเรื่อง IT: VPN, อีเมล, ระบบภายใน, แก้ไขปัญหาเบื้องต้น",
        system_prompt: "คุณคือ IT Support Bot ช่วยเหลือพนักงานเรื่องปัญหา IT เช่น VPN, อีเมล, ระบบภายใน และการแก้ไขปัญหาเบื้องต้น",
        is_active: true,
        is_web_enabled: true,
        created_at: "2026-02-10T09:00:00.000Z",
        updated_at: "2026-03-10T14:00:00.000Z",
    },
    {
        id: "bot-003",
        organization_id: MOCK_ORG.id,
        name: "Finance FAQ",
        description: "ตอบคำถามเรื่องการเงิน การเบิกค่าใช้จ่าย ใบแจ้งหนี้ และงบประมาณ",
        system_prompt: "คุณคือ Finance FAQ Bot ตอบคำถามเกี่ยวกับการเบิกค่าใช้จ่าย ใบแจ้งหนี้ งบประมาณ และกระบวนการทางการเงินของบริษัท",
        is_active: true,
        is_web_enabled: false,
        created_at: "2026-03-01T10:00:00.000Z",
        updated_at: "2026-03-18T16:00:00.000Z",
    },
];

// ── Documents ────────────────────────────────────────────────────

export const MOCK_DOCUMENTS: Document[] = [
    {
        id: "doc-001",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001",
        name: "คู่มือพนักงาน_2026.pdf",
        file_path: "/uploads/doc-001.pdf",
        file_size_bytes: 2_450_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2026-02-01T08:30:00.000Z",
    },
    {
        id: "doc-002",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001",
        name: "นโยบายวันลาและสวัสดิการ.pdf",
        file_path: "/uploads/doc-002.pdf",
        file_size_bytes: 1_200_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2026-02-05T09:00:00.000Z",
    },
    {
        id: "doc-003",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002",
        name: "IT_Security_Policy_v3.pdf",
        file_path: "/uploads/doc-003.pdf",
        file_size_bytes: 3_100_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2026-02-12T10:00:00.000Z",
    },
    {
        id: "doc-004",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002",
        name: "VPN_Setup_Guide.pdf",
        file_path: "/uploads/doc-004.pdf",
        file_size_bytes: 850_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2026-02-15T11:00:00.000Z",
    },
    {
        id: "doc-005",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-003",
        name: "ระเบียบการเบิกค่าใช้จ่าย.pdf",
        file_path: "/uploads/doc-005.pdf",
        file_size_bytes: 1_800_000,
        mime_type: "application/pdf",
        status: "ready",
        created_at: "2026-03-01T10:30:00.000Z",
    },
    {
        id: "doc-006",
        organization_id: MOCK_ORG.id,
        bot_id: null,
        name: "Company_Overview_2026.pdf",
        file_path: "/uploads/doc-006.pdf",
        file_size_bytes: 5_200_000,
        mime_type: "application/pdf",
        status: "processing",
        created_at: "2026-03-19T08:00:00.000Z",
    },
];

// ── Chat Sessions ────────────────────────────────────────────────

export const MOCK_SESSIONS: ChatSession[] = [
    {
        id: "sess-001",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001",
        platform_user_id: "web-user-001",
        platform_source: "web",
        status: "active",
        started_at: "2026-03-19T09:00:00.000Z",
        last_message_at: "2026-03-19T09:15:00.000Z",
    },
    {
        id: "sess-002",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001",
        platform_user_id: "web-user-002",
        platform_source: "web",
        status: "active",
        started_at: "2026-03-19T10:30:00.000Z",
        last_message_at: "2026-03-19T10:45:00.000Z",
    },
    {
        id: "sess-003",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002",
        platform_user_id: "web-user-003",
        platform_source: "web",
        status: "human_takeover",
        started_at: "2026-03-19T11:00:00.000Z",
        last_message_at: "2026-03-19T11:20:00.000Z",
    },
    {
        id: "sess-004",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-003",
        platform_user_id: "line-user-001",
        platform_source: "line",
        status: "active",
        started_at: "2026-03-19T13:00:00.000Z",
        last_message_at: "2026-03-19T13:10:00.000Z",
    },
    {
        id: "sess-005",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-001",
        platform_user_id: "web-user-004",
        platform_source: "web",
        status: "helped",
        started_at: "2026-03-18T15:00:00.000Z",
        last_message_at: "2026-03-18T15:30:00.000Z",
    },
    {
        id: "sess-006",
        organization_id: MOCK_ORG.id,
        bot_id: "bot-002",
        platform_user_id: "web-user-005",
        platform_source: "web",
        status: "human_takeover",
        started_at: "2026-03-19T14:00:00.000Z",
        last_message_at: "2026-03-19T14:15:00.000Z",
    },
];

// ── Chat Messages ────────────────────────────────────────────────

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    "sess-001": [
        {
            id: "msg-001",
            session_id: "sess-001",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "สวัสดีครับ ขอสอบถามเรื่องวันลาพักร้อนหน่อยครับ ปีนี้ได้กี่วัน?",
            metadata: {},
            created_at: "2026-03-19T09:01:00.000Z",
        },
        {
            id: "msg-002",
            session_id: "sess-001",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "สวัสดีครับ วันลาพักร้อนของบริษัทเราคำนวณตามอายุงานดังนี้:\n\n- อายุงาน 1-3 ปี: ลาพักร้อนได้ 6 วัน/ปี\n- อายุงาน 3-5 ปี: ลาพักร้อนได้ 10 วัน/ปี\n- อายุงาน 5 ปีขึ้นไป: ลาพักร้อนได้ 15 วัน/ปี\n\nวันลาที่ไม่ใช้ภายในปีจะสะสมได้ไม่เกิน 5 วัน ต้องแจ้งล่วงหน้าอย่างน้อย 3 วันทำการ\n\n📄 อ้างอิง: คู่มือพนักงาน 2026 หน้า 42-45",
            metadata: {},
            created_at: "2026-03-19T09:02:00.000Z",
        },
        {
            id: "msg-003",
            session_id: "sess-001",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "แล้วลาป่วยล่ะครับ ต้องมีใบรับรองแพทย์ไหม?",
            metadata: {},
            created_at: "2026-03-19T09:10:00.000Z",
        },
        {
            id: "msg-004",
            session_id: "sess-001",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "การลาป่วยมีรายละเอียดดังนี้:\n\n- ลาป่วยได้ไม่เกิน 30 วัน/ปี (ตามกฎหมายแรงงาน)\n- ลาป่วยตั้งแต่ 3 วันขึ้นไปต้องมีใบรับรองแพทย์\n- ลาป่วย 1-2 วัน ไม่ต้องมีใบรับรองแพทย์ แต่ต้องแจ้งหัวหน้างานทันที\n- กรณีฉุกเฉิน สามารถแจ้งทางโทรศัพท์หรือ LINE ได้\n\n📄 อ้างอิง: นโยบายวันลาและสวัสดิการ หน้า 12-15",
            metadata: {},
            created_at: "2026-03-19T09:15:00.000Z",
        },
    ],
    "sess-002": [
        {
            id: "msg-005",
            session_id: "sess-002",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "อยากทราบเรื่องสวัสดิการประกันสุขภาพครับ ครอบคลุมอะไรบ้าง?",
            metadata: {},
            created_at: "2026-03-19T10:31:00.000Z",
        },
        {
            id: "msg-006",
            session_id: "sess-002",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "สวัสดิการประกันสุขภาพของบริษัทครอบคลุมดังนี้:\n\n🏥 **ประกันสุขภาพกลุ่ม**\n- ค่ารักษาพยาบาลผู้ป่วยใน: สูงสุด 500,000 บาท/ครั้ง\n- ค่ารักษาพยาบาลผู้ป่วยนอก: สูงสุด 2,000 บาท/ครั้ง (30 ครั้ง/ปี)\n- ทันตกรรม: สูงสุด 5,000 บาท/ปี\n\n👨‍👩‍👧‍👦 **ครอบคลุมครอบครัว**\n- คู่สมรสและบุตร (ไม่เกิน 3 คน)\n\n📄 อ้างอิง: คู่มือพนักงาน 2026 หน้า 55-60",
            metadata: {},
            created_at: "2026-03-19T10:35:00.000Z",
        },
        {
            id: "msg-007",
            session_id: "sess-002",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "มีกองทุนสำรองเลี้ยงชีพด้วยไหมครับ?",
            metadata: {},
            created_at: "2026-03-19T10:40:00.000Z",
        },
        {
            id: "msg-008",
            session_id: "sess-002",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "มีครับ! บริษัทมีกองทุนสำรองเลี้ยงชีพ:\n\n💰 **รายละเอียดกองทุน**\n- พนักงานสมทบ: 3-10% ของเงินเดือน (เลือกได้)\n- บริษัทสมทบ: 5% ของเงินเดือน\n- สิทธิ์ได้รับส่วนสมทบของบริษัทตามอายุงาน:\n  - 1-3 ปี: 50%\n  - 3-5 ปี: 75%\n  - 5 ปีขึ้นไป: 100%\n\n📄 อ้างอิง: นโยบายวันลาและสวัสดิการ หน้า 28-32",
            metadata: {},
            created_at: "2026-03-19T10:45:00.000Z",
        },
    ],
    "sess-003": [
        {
            id: "msg-009",
            session_id: "sess-003",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "VPN เข้าไม่ได้ครับ ขึ้น error connection timeout",
            metadata: {},
            created_at: "2026-03-19T11:01:00.000Z",
        },
        {
            id: "msg-010",
            session_id: "sess-003",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "ลองทำตามขั้นตอนนี้ครับ:\n\n1. ปิด VPN client แล้วเปิดใหม่\n2. ตรวจสอบว่าเชื่อมต่ออินเทอร์เน็ตได้ปกติ\n3. ลอง server อื่น: vpn2.sundae.co.th หรือ vpn3.sundae.co.th\n4. ล้าง DNS cache: เปิด CMD แล้วพิมพ์ `ipconfig /flushdns`\n\nหากยังไม่ได้ กรุณาแจ้งรายละเอียดเพิ่มเติม หรือกดปุ่ม \"ขอพูดกับเจ้าหน้าที่\" ด้านล่างครับ",
            metadata: {},
            created_at: "2026-03-19T11:05:00.000Z",
        },
        {
            id: "msg-011",
            session_id: "sess-003",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ลองแล้วยังไม่ได้ครับ ขอคุยกับเจ้าหน้าที่เลยครับ",
            metadata: {},
            created_at: "2026-03-19T11:15:00.000Z",
        },
        {
            id: "msg-012",
            session_id: "sess-003",
            organization_id: MOCK_ORG.id,
            role: "system",
            content: "ส่งคำขอไปยังเจ้าหน้าที่แล้ว กรุณารอสักครู่...",
            metadata: {},
            created_at: "2026-03-19T11:16:00.000Z",
        },
    ],
    "sess-004": [
        {
            id: "msg-013",
            session_id: "sess-004",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "เบิกค่าเดินทางไปประชุมต่างจังหวัดทำยังไงคะ?",
            metadata: {},
            created_at: "2026-03-19T13:01:00.000Z",
        },
        {
            id: "msg-014",
            session_id: "sess-004",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "การเบิกค่าเดินทางไปประชุมต่างจังหวัด:\n\n🚗 **ขั้นตอน**\n1. กรอกแบบฟอร์ม TR-01 ในระบบ (ก่อนเดินทาง)\n2. ขออนุมัติจากหัวหน้างาน\n3. หลังเดินทาง แนบใบเสร็จทั้งหมดในระบบภายใน 7 วัน\n4. ส่งให้ฝ่ายการเงินตรวจสอบ\n\n💰 **อัตราเบิก**\n- ค่าเดินทาง: ตามจริง (มีใบเสร็จ)\n- เบี้ยเลี้ยง: 300 บาท/วัน\n- ค่าที่พัก: ไม่เกิน 1,500 บาท/คืน\n\n📄 อ้างอิง: ระเบียบการเบิกค่าใช้จ่าย หน้า 8-12",
            metadata: {},
            created_at: "2026-03-19T13:05:00.000Z",
        },
    ],
    "sess-005": [
        {
            id: "msg-015",
            session_id: "sess-005",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "รบกวนสอบถามเรื่องโบนัสปลายปีครับ",
            metadata: {},
            created_at: "2026-03-18T15:01:00.000Z",
        },
        {
            id: "msg-016",
            session_id: "sess-005",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "เรื่องโบนัสปลายปีขึ้นอยู่กับผลประเมินและผลประกอบการของบริษัท โดยทั่วไปจะประกาศในเดือนธันวาคม กรุณาสอบถามเพิ่มเติมกับ HR โดยตรงครับ",
            metadata: {},
            created_at: "2026-03-18T15:05:00.000Z",
        },
        {
            id: "msg-017",
            session_id: "sess-005",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ขอคุยกับเจ้าหน้าที่เลยครับ",
            metadata: {},
            created_at: "2026-03-18T15:10:00.000Z",
        },
        {
            id: "msg-018",
            session_id: "sess-005",
            organization_id: MOCK_ORG.id,
            role: "admin",
            content: "สวัสดีครับ เจ้าหน้าที่ HR ครับ เรื่องโบนัสปลายปีจะมีประกาศภายในสิ้นเดือนธันวาคม สามารถดูรายละเอียดเพิ่มเติมได้ที่ intranet > HR > Bonus Policy ครับ",
            metadata: {},
            created_at: "2026-03-18T15:25:00.000Z",
        },
    ],
    "sess-006": [
        {
            id: "msg-019",
            session_id: "sess-006",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "อีเมลบริษัทเข้าไม่ได้ค่ะ ขึ้น authentication failed",
            metadata: {},
            created_at: "2026-03-19T14:01:00.000Z",
        },
        {
            id: "msg-020",
            session_id: "sess-006",
            organization_id: MOCK_ORG.id,
            role: "assistant",
            content: "กรุณาลองขั้นตอนนี้:\n1. ตรวจสอบว่าใช้อีเมล @sundae.co.th\n2. ลอง reset password ที่ https://mail.sundae.co.th/reset\n3. ตรวจสอบว่า Caps Lock ไม่ได้เปิดอยู่\n\nหากยังไม่ได้ กรุณาติดต่อเจ้าหน้าที่ IT ครับ",
            metadata: {},
            created_at: "2026-03-19T14:05:00.000Z",
        },
        {
            id: "msg-021",
            session_id: "sess-006",
            organization_id: MOCK_ORG.id,
            role: "user",
            content: "ลอง reset แล้วก็ไม่ได้ค่ะ ขอพูดกับเจ้าหน้าที่ค่ะ",
            metadata: {},
            created_at: "2026-03-19T14:12:00.000Z",
        },
        {
            id: "msg-022",
            session_id: "sess-006",
            organization_id: MOCK_ORG.id,
            role: "system",
            content: "ส่งคำขอไปยังเจ้าหน้าที่แล้ว กรุณารอสักครู่...",
            metadata: {},
            created_at: "2026-03-19T14:13:00.000Z",
        },
    ],
};

// ── Org Members ──────────────────────────────────────────────────

export const MOCK_ORG_MEMBERS: Record<string, OrgMember[]> = {
    "org-001": [
        {
            user_id: "user-admin-001",
            email: "admin@sundae.local",
            full_name: "ณัฐพล วงศ์สุวรรณ",
            org_role: "owner",
            joined_at: "2026-01-15T08:00:00.000Z",
        },
        {
            user_id: "user-support-001",
            email: "support@sundae.local",
            full_name: "พิมพ์ใจ ศรีสุข",
            org_role: "member",
            joined_at: "2026-01-20T09:30:00.000Z",
        },
        {
            user_id: "user-user-001",
            email: "user@sundae.local",
            full_name: "สมชาย ใจดี",
            org_role: "member",
            joined_at: "2026-02-01T10:00:00.000Z",
        },
        {
            user_id: "user-owner-001",
            email: "owner@sundae.local",
            full_name: "ธนกร เจริญธรรม",
            org_role: "owner",
            joined_at: "2026-01-16T09:00:00.000Z",
        },
    ],
};

// ── Org Invitations ──────────────────────────────────────────────

export const MOCK_ORG_INVITATIONS: OrgInvitation[] = [];

export const MOCK_MY_INVITATIONS: Array<{
    id: string;
    organization_id: string;
    org_name: string;
    invited_email: string;
    status: "pending" | "accepted" | "revoked";
    created_at: string;
}> = [
    {
        id: "inv-approved-001",
        organization_id: MOCK_ORG.id,
        org_name: MOCK_ORG.name,
        invited_email: "approved@sundae.local",
        status: "pending",
        created_at: "2026-03-19T12:00:00.000Z",
    },
];

// ── Session User Names ──────────────────────────────────────────

export const MOCK_SESSION_USER_NAMES: Record<string, string> = {
    "sess-001": "สมชาย ใจดี (Web)",
    "sess-002": "นฤมล งามตา (Web)",
    "sess-003": "อาทิตย์ แสนดี (Web)",
    "sess-004": "ปิยะนุช วงศ์ทอง (LINE)",
    "sess-005": "กิตติพงษ์ เจริญสุข (Web)",
    "sess-006": "วรรณา สุขสมบูรณ์ (Web)",
};

// ── AI Mock Responses ────────────────────────────────────────────

export const MOCK_AI_RESPONSES = {
    leave:
        "ตามนโยบายบริษัท วันลาพักร้อนคำนวณตามอายุงาน:\n- 1-3 ปี: 6 วัน/ปี\n- 3-5 ปี: 10 วัน/ปี\n- 5 ปีขึ้นไป: 15 วัน/ปี\n\nต้องแจ้งล่วงหน้าอย่างน้อย 3 วันทำการ วันลาสะสมได้ไม่เกิน 5 วัน\n\n📄 อ้างอิง: คู่มือพนักงาน 2026 หน้า 42-45",
    benefit:
        "สวัสดิการหลักของบริษัท:\n\n🏥 ประกันสุขภาพกลุ่ม (รวมครอบครัว)\n💰 กองทุนสำรองเลี้ยงชีพ (บริษัทสมทบ 5%)\n🦷 ทันตกรรม 5,000 บาท/ปี\n📚 ทุนการศึกษาบุตร\n🏋️ สวัสดิการ fitness 1,500 บาท/เดือน\n\n📄 อ้างอิง: นโยบายสวัสดิการ หน้า 55-60",
    expense:
        "ขั้นตอนการเบิกค่าใช้จ่าย:\n\n1. กรอกแบบฟอร์มในระบบ ERP\n2. แนบใบเสร็จ/ใบกำกับภาษี\n3. ส่งให้หัวหน้างานอนุมัติ\n4. ฝ่ายการเงินตรวจสอบและโอนเงินภายใน 5 วันทำการ\n\nวงเงินอนุมัติ: หัวหน้างาน ≤ 10,000 บาท / ผู้จัดการ ≤ 50,000 บาท\n\n📄 อ้างอิง: ระเบียบการเบิกค่าใช้จ่าย หน้า 3-7",
    vpn:
        "วิธีแก้ปัญหา VPN:\n\n1. ปิดและเปิด VPN Client ใหม่\n2. ลอง server: vpn2.sundae.co.th\n3. ล้าง DNS: `ipconfig /flushdns`\n4. ตรวจสอบ Windows Firewall\n5. ลอง restart เครื่อง\n\nหากยังไม่ได้ กรุณาติดต่อ IT Support โทร 1234 หรือกด \"ขอพูดกับเจ้าหน้าที่\"\n\n📄 อ้างอิง: VPN Setup Guide หน้า 15-18",
    default:
        "ขอบคุณสำหรับคำถามครับ ระบบกำลังค้นหาข้อมูลที่เกี่ยวข้องจากฐานความรู้ขององค์กร หากต้องการข้อมูลเพิ่มเติมหรือต้องการพูดคุยกับเจ้าหน้าที่ สามารถกดปุ่ม \"ขอพูดกับเจ้าหน้าที่\" ได้ตลอดเวลาครับ",
} as const;
