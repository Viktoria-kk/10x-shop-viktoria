import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthUser, ProfileDetails } from '../types/user'

const AUTH_STORAGE_KEY = 'shop_auth_user'

function readSavedUser(): AuthUser | null {
  try {
    const saved = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!saved) return null

    const value: unknown = JSON.parse(saved)
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('username' in value)
      || typeof value.username !== 'string' || !value.username.trim()) return null

    const user: AuthUser = { username: value.username }
    if ('email' in value) {
      if (typeof value.email !== 'string') return null
      user.email = value.email
    }
    if ('firstName' in value) {
      if (typeof value.firstName !== 'string') return null
      user.firstName = value.firstName
    }
    if ('lastName' in value) {
      if (typeof value.lastName !== 'string') return null
      user.lastName = value.lastName
    }
    if ('phone' in value) {
      if (typeof value.phone !== 'string') return null
      user.phone = value.phone
    }
    return user
  } catch {
    return null
  }
}

interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (username: string, email?: string) => void
  updateProfile: (details: ProfileDetails) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSavedUser)

  useEffect(() => {
    try {
      if (user) sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      else sessionStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // The current tab still works if browser storage is unavailable.
    }
  }, [user])

  function login(username: string, email?: string) {
    setUser(email ? { username, email } : { username })
  }

  function logout() {
    setUser(null)
  }

  function updateProfile(details: ProfileDetails) {
    setUser((current) => current ? { ...current, ...details } : null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
