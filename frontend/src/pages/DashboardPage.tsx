/**
 * DashboardPage — Role-aware with Pending Approval state
 *
 * - Approved users/admins: see full metrics
 * - Unapproved users: see "Pending Approval" lockout
 * - Support: see simplified overview
 */

import { useAuthStore, selectIsSupport } from "../store/authStore";

// ── Pending Approval Component ──────────────────────────────────

function PendingApprovalState() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-4xl mx-auto mb-6">
                    ⏳
                </div>
                <h2 className="text-xl font-bold text-steel-900 mb-2">
                    บัญชีกำลังรอการอนุมัติ
                </h2>
                <p className="text-sm text-steel-500 leading-relaxed mb-6">
                    บัญชีของคุณกำลังรอการอนุมัติจากเจ้าหน้าที่ Support<br />
                    คุณจะสามารถใช้ฟีเจอร์ทั้งหมดได้หลังจากได้รับการอนุมัติ
                </p>
                <div className="p-4 bg-steel-50 rounded-2xl border border-steel-200">
                    <p className="text-xs text-steel-500 mb-3 font-medium">สิ่งที่คุณทำได้ระหว่างรออนุมัติ:</p>
                    <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2 text-sm text-steel-600">
                            <span className="text-brand-400">✓</span>ดู Dashboard ภาพรวม
                        </div>
                        <div className="flex items-center gap-2 text-sm text-steel-600">
                            <span className="text-brand-400">✓</span>ทดลองใช้ Web Chat
                        </div>
                        <div className="flex items-center gap-2 text-sm text-steel-400">
                            <span>✗</span>อัปโหลดเอกสาร
                        </div>
                        <div className="flex items-center gap-2 text-sm text-steel-400">
                            <span>✗</span>สร้าง Bot
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Metric Card ─────────────────────────────────────────────────

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
    changeType: "up" | "down" | "neutral";
    accentColor: string;
    disabled?: boolean;
}

function MetricCard({ icon, label, value, change, changeType, accentColor, disabled }: MetricCardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-steel-100 p-6 transition-all duration-300 group ${disabled ? "opacity-50" : "hover:shadow-lg hover:shadow-steel-200/50"
            }`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentColor} transition-transform duration-300 ${disabled ? "" : "group-hover:scale-110"}`}>
                    {icon}
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeType === "up" ? "bg-emerald-50 text-emerald-700"
                    : changeType === "down" ? "bg-red-50 text-red-600"
                        : "bg-steel-100 text-steel-500"
                    }`}>
                    {changeType === "up" && "↑"}{changeType === "down" && "↓"} {change}
                </span>
            </div>
            <p className="text-3xl font-bold text-steel-900 tracking-tight">{value}</p>
            <p className="text-sm text-steel-500 mt-1">{label}</p>
        </div>
    );
}

// ── Page ────────────────────────────────────────────────────────

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);

    const isSupport = useAuthStore(selectIsSupport);

    // Unapproved user → lockout
    if (user?.role === "user" && !user.is_approved) {
        return <PendingApprovalState />;
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-steel-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-steel-500 mt-1">
                    {isSupport ? "ภาพรวมระบบ — โหมดเจ้าหน้าที่ Support" : "ภาพรวมระบบ SUNDAE — ข้อมูลอัปเดตล่าสุด"}
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <MetricCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-600"><path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" /></svg>}
                    label="เอกสารทั้งหมด" value="1,247" change="+12%" changeType="up" accentColor="bg-brand-100"
                />
                <MetricCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-steel-600"><path d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z" /><path fillRule="evenodd" d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 0 1.5h-.01a.75.75 0 0 1-.75-.75Zm-2.5 0a.75.75 0 0 1 .75-.75H13.5a.75.75 0 0 1 0 1.5h-.01a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>}
                    label="Bot ที่ใช้งาน" value="8" change="+2" changeType="up" accentColor="bg-steel-100"
                />
                {isSupport ? (
                    <MetricCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-600"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" /></svg>}
                        label="ผู้ใช้รออนุมัติ" value="3" change="ใหม่" changeType="neutral" accentColor="bg-amber-50"
                    />
                ) : (
                    <MetricCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-violet-600"><path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0 1 10 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 0 1-5.183.501.78.78 0 0 0-.528.224l-3.579 3.58A.75.75 0 0 1 6 17.25v-3.443a41.033 41.033 0 0 1-2.57-.33C2.993 13.244 2 11.986 2 10.573V5.426c0-1.413.993-2.67 2.43-2.902Z" clipRule="evenodd" /></svg>}
                        label="แชททั้งหมดวันนี้" value="3,842" change="+24%" changeType="up" accentColor="bg-violet-50"
                    />
                )}
                <MetricCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>}
                    label="ความแม่นยำเฉลี่ย" value="94.2%" change="+1.3%" changeType="up" accentColor="bg-emerald-50"
                />
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl border border-steel-100 p-6">
                <h2 className="text-base font-semibold text-steel-800 mb-4">สถานะระบบ</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                        { name: "RAG Pipeline", ok: true },
                        { name: "Ollama", ok: true },
                        { name: "Embedding", ok: true },
                        { name: "Supabase DB", ok: true },
                        { name: "LINE Webhook", ok: true },
                    ].map((svc) => (
                        <div key={svc.name} className="flex items-center gap-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${svc.ok ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            <span className="text-steel-600">{svc.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
