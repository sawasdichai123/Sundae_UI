/**
 * Knowledge Base Page — Document Upload & Management
 */

export default function KnowledgeBasePage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    + อัปโหลดเอกสาร
                </button>
            </div>

            {/* Document Table Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                ชื่อไฟล์
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                สถานะ
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                ขนาด
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                วันที่อัปโหลด
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                colSpan={5}
                                className="px-6 py-12 text-center text-gray-400 text-sm"
                            >
                                ยังไม่มีเอกสาร — กดปุ่ม "อัปโหลดเอกสาร" เพื่อเริ่มต้น
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
