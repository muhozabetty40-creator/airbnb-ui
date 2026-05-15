export interface AuthState {
  isAuthenticated: boolean
  email: string | null
  userId: string | null
  role: string | null
  loading: boolean
  error: string | null
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, username: string, password: string, phone: string, role?: string) => Promise<void>
  logout: () => void
}
