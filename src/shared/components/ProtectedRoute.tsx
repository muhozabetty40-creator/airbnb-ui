import { Navigate } from 'react-router-dom'
import { useEffect, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../features/auth/hooks/useAuth'

interface Props { children: ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) toast.error('Please log in to access this page')
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
