import { createContext, useState, useEffect, type ReactNode } from 'react'
import { apiService } from '../../../api'
import type { AuthContextValue } from '../types'

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = apiService.getToken()
    const user = apiService.getUser()
    
    if (token && user) {
      setIsAuthenticated(true)
      setEmail(user.email)
      setUserId(user.id)
      setRole(user.role)
    }
    
    setLoading(false)
  }, [])

  const login = async (emailInput: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      console.log("Starting login with:", emailInput)
      
      const response = await apiService.login(emailInput, password)
      console.log("Login response:", response)
      
      // Store token and user data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      console.log("Token and user stored, updating state")
      
      setIsAuthenticated(true)
      setEmail(response.user.email)
      setUserId(response.user.id)
      setRole(response.user.role)
      console.log("State updated, login complete. Role:", response.user.role)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      console.error("Login error:", errorMessage)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    name: string,
    emailInput: string,
    username: string,
    password: string,
    phone: string,
    role: string = 'GUEST'
  ) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await apiService.register(name, emailInput, username, password, phone, role)
      
      // Store token and user data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setIsAuthenticated(true)
      setEmail(response.user.email)
      setUserId(response.user.id)
      setRole(response.user.role)
      console.log("Registration complete. Role:", response.user.role)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    apiService.logout()
    setIsAuthenticated(false)
    setEmail(null)
    setUserId(null)
    setRole(null)
    setError(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        email, 
        userId,
        role,
        loading,
        error,
        login, 
        register,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
