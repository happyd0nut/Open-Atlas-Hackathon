import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { getOrCreateGuestSession } from './guestSession'

const EffectiveUserContext = createContext(null)

// The provider creates the logic to describe the context to be passed down to
// children of this wrapper. Using the 'createContext' hook EffectiveUserContext,
// we obtain a value obtainable by a 'useContext' hook which we wrap in another
// function we call useEffectiveUser(), the ultimate tool/hook we want to obtain
// the values obtained by the context. What is stored in value is passed on as ctx 
// which you can destructure from the custom hook.

export function EffectiveUserProvider({children}) {
    const { isLoaded, isSignedIn, user } = useUser()
    const [guest, setGuest] = useState(null)

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            setGuest(getOrCreateGuestSession())
        }
    }, [isLoaded, isSignedIn])

    let value

    if (!isLoaded) {
        // Clerk is still checking authentication status
        value = { status: "loading", user: null, isGuest: false }
    } else if (isSignedIn) {
        // User is successfully logged in via Clerk
        value = { status: "authenticated", user, isGuest: false }
    } else if (!guest) {
        // Clerk finished loading (logged out), but our guest session state hasn't resolved yet
        value = { status: "loading", user: null, isGuest: false }
    } else {
        // Both Clerk and guest session states are completely resolved
        value = { status: "guest", user: guest, isGuest: true }
    }

    return (
        <EffectiveUserContext.Provider value={value}>
            {children}
        </EffectiveUserContext.Provider>
    )
}

// Created a new hook useEffectiveUser to access all user information; guest or authenticated
// Hook will return object of the form {status, user, isGuest}
// Wrapper for the EffectiveUserContext defined above
export function useEffectiveUser() {
    const ctx = useContext(EffectiveUserContext)
    if (!ctx) throw new Error('useEffectiveUser must be used inside EffectiveUserProvider')
    console.log(ctx)
    return ctx
}
