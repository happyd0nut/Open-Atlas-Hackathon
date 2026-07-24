import { useLocation } from "react-router-dom";
import SideBar from './components/SideBar'
import MainContent from './components/MainContent'

export default function Dashboard() {

  const location = useLocation();
  const uploadResult = location.state?.uploadResult;

  return (
    <>
      <div className="flex h-screen pt-5 text-black">
        <div className="block w-xs h-full border-r border-black-200 py-5 px-10">
          <SideBar />
        </div>
        <div className="block w-full overflow-y-auto">
          <MainContent result={uploadResult} />
        </div>
      </div>
    </>
      
  )
}
