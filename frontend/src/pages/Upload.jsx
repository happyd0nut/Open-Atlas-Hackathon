import { Link } from 'react-router-dom'
import UploadBox from './components/UploadBox'
import { UploadCloud } from 'lucide-react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/clerk-react'


export default function Upload() {
  return (
    <>
      <nav className="fixed top-0 right-0 p-6">
        <div className="flex justify-end gap-3">
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
