import { useLocation } from "react-router-dom";
import SideBar from './components/SideBar'
import MainContent from './components/MainContent'

export default function Dashboard() {

  const location = useLocation();
  const loadId = location.state?.loadId;

  return (
    <>
      <div className="flex h-screen text-black">
        <div className="block w-xs h-full border-r border-gray-300 py-10 px-10">
          <SideBar />
        </div>
        <div className="block w-full overflow-y-auto">
          <MainContent loadId={loadId} />
        </div>
      </div>
    </>
      
  )
}
