import { useLocation, useParams } from "react-router-dom";
import SideBar from './components/SideBar'
import MainContent from './components/MainContent'
import { UserButton } from '@clerk/clerk-react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react'

export default function Dashboard() {

  const location = useLocation();
  const { docId } = useParams();

  return (
    <>
      <div className="flex h-screen text-black">
        <div className="block w-xs h-full border-r border-gray-300 py-10 px-10">
          <SideBar />
        </div>
        <div className="block w-full overflow-y-auto py-5">
          <div className="flex justify-between py-5 px-10 text-black">
            <h3>Dashboard</h3>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="right-0 px-4 py-2 text-sm font-medium bg-[#0F3B36] text-white rounded-lg hover:opacity-90">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton appearance={{
                    elements: {
                    avatarBox: "w-8 h-8"
                    }
                }}/>
            </SignedIn>
          </div>
          <MainContent loadId={docId} />
        </div>
      </div>
    </>
  )
}
