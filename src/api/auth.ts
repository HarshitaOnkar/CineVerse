const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface SignupPayload {
  username: string
  email: string
  phone: string
  password: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResult {
  success: boolean
  message: string
  username?: string
  offline?: boolean
}

const CONNECTION_ERROR_MSG = `Can't connect to the server. Make sure the backend is running (e.g. run "mvn spring-boot:run" in the backend folder) and reachable at ${API_BASE}.`

function isConnectionError(err: unknown): boolean {
  if (err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('fetch'))) return true
  if (err instanceof Error && (err.message.includes('connect') || err.message.includes('server') || err.message.includes('Network'))) return true
  return false
}

async function authFetch(url: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options)
  } catch (err) {
    const message = isConnectionError(err)
      ? CONNECTION_ERROR_MSG
      : (err instanceof Error ? err.message : 'Network error')
    throw new Error(message)
  }
}

async function parseJson(res: Response): Promise<AuthResult> {
  const text = await res.text()
  if (!text.trim()) {
    return { success: false, message: res.ok ? 'OK' : 'Request failed' }
  }
  try {
    return JSON.parse(text) as AuthResult
  } catch {
    throw new Error(res.ok ? 'Invalid response' : CONNECTION_ERROR_MSG)
  }
}

const OFFLINE_USERS_KEY = 'cineverse_offline_users'
const OFFLINE_MODE_KEY = 'cineverse_offline_mode'

function getOfflineUsers(): string[] {
  try {
    const raw = localStorage.getItem(OFFLINE_USERS_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as unknown
    return Array.isArray(arr) ? arr.filter((u): u is string => typeof u === 'string') : []
  } catch {
    return []
  }
}

function addOfflineUser(username: string): void {
  const users = getOfflineUsers()
  if (!users.includes(username)) {
    users.push(username)
    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users))
  }
  localStorage.setItem(OFFLINE_MODE_KEY, 'true')
}

export function isOfflineMode(): boolean {
  return localStorage.getItem(OFFLINE_MODE_KEY) === 'true'
}

export function clearOfflineMode(): void {
  localStorage.removeItem(OFFLINE_MODE_KEY)
}

export async function signup(payload: SignupPayload): Promise<AuthResult> {
  try {
    const res = await authFetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await parseJson(res)
    if (!res.ok) {
      throw new Error(data.message || 'Signup failed')
    }
    return data
  } catch (err) {
    if (isConnectionError(err)) {
      addOfflineUser(payload.username.trim())
      return { success: true, message: 'Account created (offline mode).', username: payload.username.trim(), offline: true }
    }
    throw err
  }
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  try {
    const res = await authFetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await parseJson(res)
    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }
    return data
  } catch (err) {
    if (isConnectionError(err)) {
      const users = getOfflineUsers()
      const username = payload.username.trim()
      if (users.includes(username)) {
        localStorage.setItem(OFFLINE_MODE_KEY, 'true')
        return { success: true, message: 'Signed in (offline mode).', username, offline: true }
      }
      throw new Error('No account found. Please sign up.')
    }
    throw err
  }
}

export const AUTH_USER_KEY = 'cineverse_user'

export function setLoggedInUser(username: string): void {
  localStorage.setItem(AUTH_USER_KEY, username)
  window.dispatchEvent(new Event('cineverse-auth'))
}

export function getLoggedInUser(): string | null {
  return localStorage.getItem(AUTH_USER_KEY)
}

export function logout(): void {
  localStorage.removeItem(AUTH_USER_KEY)
  clearOfflineMode()
  window.dispatchEvent(new Event('cineverse-auth'))
}
