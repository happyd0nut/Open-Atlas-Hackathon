const GUEST_KEY = "guest_key"
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000

function generateGuestId() {
    return 'guest_' + crypto.randomUUID()
}

export function getOrCreateGuestSession() {
    const data = sessionStorage.getItem(GUEST_KEY)

    if (data) {
        try {
            const session = JSON.parse(data)
            const isExpired = Date.now() - session.lastActive > INACTIVITY_LIMIT_MS

            if (!isExpired) {
                session.lastActive = Date.now()
                sessionStorage.setItem(GUEST_KEY, JSON.stringify(session))
                return session
            }
        } catch {
            // corrupted data — fall through and create a fresh session
        }

        sessionStorage.removeItem(GUEST_KEY)
    }

    const newSession = { id: generateGuestId(), lastActive: Date.now() }
    sessionStorage.setItem(GUEST_KEY, JSON.stringify(newSession))
    return newSession
}

export function clearGuestSession() {
    sessionStorage.removeItem(GUEST_KEY)
}
