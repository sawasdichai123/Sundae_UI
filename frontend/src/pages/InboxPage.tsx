/**
 * Inbox Page — Unified Inbox & Human-in-the-loop Chat Operations
 */

export default function InboxPage() {
    return (
        <div className="flex h-full -m-8">
            {/* Chat List Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-lg font-bold text-gray-900">Inbox</h1>
                    <input
                        type="text"
                        placeholder="ค้นหาแชท..."
                        className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 text-center text-gray-400 text-sm">
                        ยังไม่มีแชท
                    </div>
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                    <span className="text-5xl block mb-4">💬</span>
                    <p className="text-sm">เลือกแชทจากรายการทางซ้ายเพื่อดูรายละเอียด</p>
                </div>
            </div>
        </div>
    );
}
