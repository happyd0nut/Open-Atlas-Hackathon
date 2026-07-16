import { EllipsisVertical } from 'lucide-react'

export default function SideBar() {
    return (
        <div className="block w-xs h-full border-r border-black-200">
          <div className="flex justify-between py-5 px-10 text-black">
            <p className="font-extrabold">Documents</p>
            <EllipsisVertical className="w-5 h-6" style={{ color: '#000000' }} />
          </div>
        </div>
    )
}
