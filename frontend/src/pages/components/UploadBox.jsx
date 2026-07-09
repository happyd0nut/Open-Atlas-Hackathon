import { UploadCloud, FileText, X } from 'lucide-react'

export default function UploadBox() {
    return (
        <>
            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
                <UploadCloud className="w-6 h-6" style={{ color: '#0F3B36' }} />
                <p className="font-bold">
                    Drop your document here
                </p>
                <p className="text-sm text-gray-500 mt-4 max-w-sm">
                    Lease, insurance, visa notice, medical bill, bank letter — we'll explain it.
                </p>
                <button className="mt-5 px-3 py-2 text-xs font-medium bg-[#0F3B36] text-white rounded-lg hover:opacity-90">
                    Choose a PDF File
                </button>
            </div>
        </>
    )
}
