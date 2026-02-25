/**
 * Bots Page — Bot Settings, Prompts, LINE Channel Tokens
 */

export default function BotsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Bots</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    + สร้าง Bot ใหม่
                </button>
            </div>

            {/* Bot Cards Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-8 flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
                    <span className="text-4xl mb-3">🤖</span>
                    <p className="text-sm">ยังไม่มี Bot — กดปุ่ม "สร้าง Bot ใหม่"</p>
                </div>
            </div>
        </div>
    );
}
