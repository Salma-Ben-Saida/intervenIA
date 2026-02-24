export type AuthUser = {
    userId: string
    role: string
    username: string
    token: string
    zone?: string
    speciality?: string
}

export function saveAuth(data: AuthUser) {
    localStorage.setItem("auth", JSON.stringify(data))
}

export function getAuth(): AuthUser | null {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem("auth")
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
}

export function clearAuth() {
    localStorage.removeItem("auth")
}