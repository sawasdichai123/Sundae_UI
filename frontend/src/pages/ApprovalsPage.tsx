/**
 * ApprovalsPage — Support/Admin user approval dashboard
 *
 * Stub with dummy data. Will be connected to API.
 */

import { useState } from "react";

interface PendingUser {
    id: string;
    email: string;
    full_name: string;
    requested_at: string;
    status: "pending" | "approved";
}

const INITIAL_USERS: PendingUser[] = [
    { id: "u1", email: "somchai@nt.co.th", full_name: "สมชาย ใจดี", requested_at: "2025-02-24T10:00:00Z", status: "pending" },
    { id: "u2", email: "suda@nt.co.th", full_name: "สุดา วงศ์ดี", requested_at: "2025-02-23T15:30:00Z", status: "pending" },
    { id: "u3", email: "prasit@nt.co.th", full_name: "ประสิทธิ์ สุขใจ", requested_at: "2025-02-22T09:15:00Z", status: "pending" },
];

export default function ApprovalsPage() {
    const [users, setUsers] = useState<PendingUser[]>(INITIAL_USERS);

    const handleApprove = (userId: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
        );
    };

    const pending = users.filter((u) => u.status === "pending");
    const approved = users.filter((u) => u.status === "approved");

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-steel-900 tracking-tight">
                    อนุมัติผู้ใช้งาน
                </h1>
                <p className="text-sm text-steel-500 mt-1">
                    ตรวจสอบและอนุมัติผู้ใช้ที่สมัครเข้าระบบ
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <p className="text-2xl font-bold text-amber-700">{pending.length}</p>
                    <p className="text-sm text-amber-600">รออนุมัติ</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <p className="text-2xl font-bold text-emerald-700">{approved.length}</p>
                    <p className="text-sm text-emerald-600">อนุมัติแล้ว</p>
                </div>
            </div>

            {/* Pending List */}
            <div className="bg-white rounded-2xl border border-steel-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-steel-100">
                    <h2 className="text-sm font-semibold text-steel-800">ผู้ใช้ที่รออนุมัติ</h2>
                </div>

                {pending.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-steel-400 text-sm">ไม่มีผู้ใช้ที่รออนุมัติ ✓</p>
                    </div>
                ) : (
                    <div className="divide-y divide-steel-100">
                        {pending.map((user) => (
                            <div key={user.id} className="px-6 py-4 flex items-center gap-4 hover:bg-steel-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                                    {user.full_name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-steel-800">{user.full_name}</p>
                                    <p className="text-xs text-steel-400">{user.email}</p>
                                </div>
                                <span className="text-xs text-steel-400 shrink-0 hidden sm:block">
                                    {new Date(user.requested_at).toLocaleDateString("th-TH")}
                                </span>
                                <button
                                    onClick={() => handleApprove(user.id)}
                                    className="px-4 py-2 bg-brand-400 text-steel-900 text-xs font-bold rounded-xl hover:bg-brand-500 transition-colors cursor-pointer shadow-sm"
                                >
                                    อนุมัติ
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recently Approved */}
            {approved.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl border border-steel-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-steel-100">
                        <h2 className="text-sm font-semibold text-steel-800">อนุมัติแล้ว (เซสชันนี้)</h2>
                    </div>
                    <div className="divide-y divide-steel-100">
                        {approved.map((user) => (
                            <div key={user.id} className="px-6 py-4 flex items-center gap-4 opacity-70">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                                    ✓
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-steel-800">{user.full_name}</p>
                                    <p className="text-xs text-steel-400">{user.email}</p>
                                </div>
                                <span className="text-xs text-emerald-600 font-medium">อนุมัติแล้ว</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
