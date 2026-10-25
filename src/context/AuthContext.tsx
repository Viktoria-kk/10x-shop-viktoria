import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AuthUser, ProfileDetails } from '../types/user'

interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (username: string, email?: string) => void
  updateProfile: (details: ProfileDetails) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

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
