import { EllipsisVertical, Upload } from 'lucide-react'

export default function SideBar() {
    return (
      <>
        <div className="flex justify-between text-black">
          <p className="font-extrabold">Documents</p>
          <EllipsisVertical className="w-5 h-6" style={{ color: '#000000' }} />
        </div>
        <div className="flex mt-10">
          <Upload className="w-4 h-6 mr-1" style={{ color: '#000000' }} />
          <p className="">Upload New Doc</p>
        </div>
      </>
      
    )
}
