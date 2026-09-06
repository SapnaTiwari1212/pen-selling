export interface User {
  id: string
  fullName: string
  email: string
  password: string
  createdAt: string
}

const USERS_KEY = 'penmart_users'
const SESSION_KEY = 'penmart_session'

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUser(user: User): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  )
}

export function isEmailRegistered(email: string): boolean {
  return findUserByEmail(email) !== undefined
}

export function authenticateUser(
  email: string,
  password: string,
): User | null {
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function saveSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
