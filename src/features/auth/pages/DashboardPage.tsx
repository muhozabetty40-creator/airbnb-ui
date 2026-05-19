import { useState } from 'react'
import { NavLink, useNavigate, Routes, Route } from 'react-router-dom'
import {
  AiOutlineDashboard, AiOutlineWallet,
  AiOutlineMessage, AiOutlineBook, AiOutlineUser,
  AiOutlineLogout
} from 'react-icons/ai'
import { BsListUl } from 'react-icons/bs'
import { FaUsers, FaList } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import BookingsPage from './BookingsPage'
import MyListingsPage from './MyListingsPage'
import ReviewsPage from './ReviewsPage'
import MessagesPage from './MessagesPage'
import WalletPage from './WalletPage'
import HostDashboard from './HostDashboard'
import GuestDashboard from './GuestDashboard'
import AdminDashboard from './AdminDashboard'
import AddListingDashboard from './AddListingDashboard'
import './DashboardPage.css'

export default function DashboardPage() {
  const { email, logout, role } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Host Navigation
  const HOST_NAV = [
    { icon: <AiOutlineDashboard size={18} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <BsListUl size={18} />, label: 'My Listings', to: '/dashboard/listings' },
    { icon: <AiOutlineBook size={18} />, label: 'My Bookings', to: '/dashboard/bookings' },
    { icon: <AiOutlineWallet size={18} />, label: 'Earnings', to: '/dashboard/wallet' },
    { icon: <AiOutlineMessage size={18} />, label: 'Messages', to: '/dashboard/messages' },
  ]

  // Guest Navigation
  const GUEST_NAV = [
    { icon: <AiOutlineDashboard size={18} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <AiOutlineBook size={18} />, label: 'My Bookings', to: '/dashboard/bookings' },
    { icon: <AiOutlineMessage size={18} />, label: 'Messages', to: '/dashboard/messages' },
  ]

  // Admin Navigation
  const ADMIN_NAV = [
    { icon: <AiOutlineDashboard size={18} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <FaUsers size={18} />, label: 'Users', to: '/dashboard/users' },
    { icon: <FaList size={18} />, label: 'Bookings', to: '/dashboard/admin-bookings' },
    { icon: <BsListUl size={18} />, label: 'Listings', to: '/dashboard/admin-listings' },
  ]

  const navItems = role === 'HOST' ? HOST_NAV : role === 'ADMIN' ? ADMIN_NAV : GUEST_NAV

  return (
    <div className="db-layout">
      {/* ── Sidebar ── */}
      <aside className={`db-sidebar${sidebarOpen ? '' : ' db-sidebar--closed'}`}>
        <nav className="db-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => `db-nav__item${isActive ? ' db-nav__item--active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <p className="db-nav__section">ACCOUNT</p>
          <NavLink to="/profile" className={({ isActive }) => `db-nav__item${isActive ? ' db-nav__item--active' : ''} db-nav__item--account`}>
            <AiOutlineUser size={16} />
            <span className="db-nav__account-label">Edit Profile</span>
          </NavLink>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ff385c',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: '500',
              marginTop: '8px'
            }}
          >
            <AiOutlineLogout size={16} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="db-main">
        <Routes>
          <Route path="/" element={role === 'HOST' ? <HostDashboard /> : role === 'ADMIN' ? <AdminDashboard /> : <GuestDashboard />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/listings" element={<MyListingsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/add-listing" element={<AddListingDashboard />} />
        </Routes>
      </div>
    </div>
  )
}
