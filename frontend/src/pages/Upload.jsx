import { Link, useNavigate } from 'react-router-dom'
import UploadBox from './components/UploadBox'
import { UploadCloud } from 'lucide-react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/clerk-react'
import { useEffectiveUser } from '../../lib/EffectiveUserContext'


export default function Upload() {

  const { status, user, isGuest } = useEffectiveUser();
  const navigate = useNavigate();

  console.log("Current user:", user)

  return (
    <>
      <nav className="fixed top-0 right-0 p-3 mr-6 mt-3">
        <div className="flex justify-end gap-3">
          {user ? (<div className="flex p-2 mr-3 border-1 bg-white rounded-md">
            <Link to="/dashboard/0" >
                    <p className="text-black">To Dashboard</p>
            </Link>
          </div>) : <></> }
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium bg-[#0F3B36] text-white rounded-lg hover:opacity-90">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-4xl font-bold text-black mt-10">
          Household documents made simple. 
        </h1>
        <div className="mt-2 max-w-xl">
          <h2 className="text-md text-gray-600">
            Navigate complex documents with confidence. Upload paperwork, understand what it means, and know exactly what to do next.        
          </h2>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <UploadBox />
      </div>
    </>
    
  )
}
