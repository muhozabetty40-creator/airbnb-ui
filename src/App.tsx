import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import HomePage from './pages/HomePage'
import { LoginPage, SignupPage } from './features/auth'
import Navbar from './shared/components/Navbar'
import ProtectedRoute from './shared/components/ProtectedRoute'
import NotFound from './shared/components/NotFound'
import Spinner from './shared/components/Spinner'
import './components/listings.css'
import './App.css'

const ListingDetail = lazy(() => import('./features/listings/pages/ListingDetail'))
const ListingPage = lazy(() => import('./pages/ListingPage'))
const DashboardPage = lazy(() => import('./features/auth/pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AddListingPage = lazy(() => import('./pages/AddListingPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))

NProgress.configure({ showSpinner: false })

export default function App() {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    const t = setTimeout(() => NProgress.done(), 100)
    return () => clearTimeout(t)
  }, [location])

  return (
    <>
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingPage />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-listing"
            element={
              <ProtectedRoute>
                <AddListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
