import { Link } from 'react-router-dom'
import UploadBox from './components/UploadBox'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/clerk-react'
import { useEffectiveUser } from '../../lib/EffectiveUserContext'
import { LayoutDashboard } from "lucide-react";


export default function Upload() {

  const { status, user, isGuest } = useEffectiveUser();

  console.log("Current user:", user)

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-3 mt-3">
        <div className="flex items-center justify-between px-6">

          {/* LEFT SIDE - Dashboard */}
          <div>
            {user && (
              <Link
                to="/dashboard/0"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-black text-sm font-medium hover:bg-gray-50 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* RIGHT SIDE - Sign In / Profile */}
          <div className="flex items-center gap-3">
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

        </div>
      </nav>


      {/* Page Heading */}
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-4xl font-bold text-black mt-10">
          Household documents made simple.
        </h1>

        <div className="mt-2 max-w-xl">
          <h2 className="text-md text-gray-600">
            Navigate complex documents with confidence. Upload paperwork,
            understand what it means, and know exactly what to do next.
          </h2>
        </div>
      </div>


      {/* Upload Box */}
      <div className="flex flex-col items-center justify-center mt-10">
        <UploadBox />
      </div>
    </>
  )
}