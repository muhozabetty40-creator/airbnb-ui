import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BsMoon, BsSun } from 'react-icons/bs'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { MdLogout, MdDashboard, MdNotifications } from 'react-icons/md'
import { FaUser, FaHome, FaList, FaPlus, FaEnvelope } from 'react-icons/fa'
import { useFavorites } from '../../features/listings/hooks/useFavorites'
import { useAuth } from '../../features/auth/hooks/useAuth'
import SavedListings from '../../features/listings/components/SavedListings'
import NotificationsPanel from './NotificationsPanel'

const LINK_STYLE = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', color: '#1a1a1a',
  textDecoration: 'none', fontSize: '14px', transition: 'background 0.15s'
} as const

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const { count } = useFavorites()
  const { isAuthenticated, logout, email, role } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isGuest = isAuthenticated && role === 'GUEST'
  const isHost = isAuthenticated && role === 'HOST'
  const isAdmin = isAuthenticated && role === 'ADMIN'
  const roleLabel = role === 'HOST' ? '🏠 Host' : role === 'ADMIN' ? '🛡️ Admin' : '👤 Guest'
  const initials = email?.[0]?.toUpperCase() || 'U'

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDarkMode(saved)
    if (saved) document.documentElement.style.filter = 'invert(1)'
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/login')
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.style.filter = 'invert(1)'
    } else {
      document.documentElement.style.filter = 'none'
    }
  }

  const close = () => { setProfileOpen(false); setMenuOpen(false) }

  return (
    <header className="topbar">
      {/* Brand */}
      <NavLink to="/" className="brand">
        <span className="brand-logo">List</span>
        <span className="brand-highlight">On</span>
      </NavLink>

      {/* Main Navigation - Different for each role */}
      <nav className={`site-nav${menuOpen ? ' open' : ''}`}>
        {/* Guest Navigation */}
        {isGuest && (
          <>
            <NavLink to="/" onClick={close} className={({ isActive }) => isActive && location.pathname === '/' ? 'nav-active' : ''}>Home</NavLink>
            <NavLink to="/listings" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Listings</NavLink>
          </>
        )}

        {/* Host Navigation */}
        {isHost && (
          <>
            <NavLink to="/" onClick={close} className={({ isActive }) => isActive && location.pathname === '/' ? 'nav-active' : ''}>Home</NavLink>
            <NavLink to="/listings" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Browse</NavLink>
            <NavLink to="/add-listing" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Add Listing</NavLink>
          </>
        )}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <NavLink to="/" onClick={close} className={({ isActive }) => isActive && location.pathname === '/' ? 'nav-active' : ''}>Home</NavLink>
          </>
        )}

        {/* Public Navigation */}
        {!isAuthenticated && (
          <>
            <NavLink to="/" onClick={close} className={({ isActive }) => isActive && location.pathname === '/' ? 'nav-active' : ''}>Home</NavLink>
            <NavLink to="/listings" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Listings</NavLink>
          </>
        )}
      </nav>

      {/* Right Actions */}
      <div className="top-actions">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          className="icon-button"
          aria-label="Toggle theme"
          onClick={toggleDarkMode}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <BsSun size={18} /> : <BsMoon size={18} />}
        </button>

        {/* Notifications - Authenticated only */}
        {isAuthenticated && (
          <button type="button" className="icon-button" aria-label="Notifications" title="Notifications" onClick={() => setNotificationsOpen(true)}>
            <MdNotifications size={18} color="#ff5724" />
            {unreadNotifications > 0 && <span className="badge">{unreadNotifications}</span>}
          </button>
        )}

        {/* Saved Listings - Guest only */}
        {isGuest && (
          <div className="fav-wrap">
            <button type="button" className="icon-button" aria-label="Saved" onClick={() => setFavOpen(o => !o)} title="Saved Listings">
              {count > 0 ? <AiFillHeart size={18} color="#ff5724" /> : <AiOutlineHeart size={18} />}
              <span className="badge">{count}</span>
            </button>
            <SavedListings open={favOpen} onClose={() => setFavOpen(false)} />
          </div>
        )}

        {/* Login Button - Not authenticated */}
        {!isAuthenticated && (
          <NavLink to="/login" className="action-button" style={{ textDecoration: 'none' }}>
            Login
          </NavLink>
        )}

        {/* Profile Avatar + Dropdown - Authenticated */}
        {isAuthenticated && (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: '#ff5724',
                color: '#fff', border: 'none', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {initials}
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 240, zIndex: 1000, overflow: 'hidden'
              }}>
                {/* User Info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{email}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6b7280' }}>{roleLabel}</p>
                </div>

                {/* Profile Link */}
                <NavLink to="/profile" onClick={close}
                  style={LINK_STYLE}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <FaUser size={13} color="#6b7280" /> My Profile
                </NavLink>

                {/* Dashboard Link */}
                <NavLink to="/dashboard" onClick={close}
                  style={{ ...LINK_STYLE, borderBottom: '1px solid #f3f4f6' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <MdDashboard size={14} color="#6b7280" /> Dashboard
                </NavLink>

                {/* Host-specific options */}
                {isHost && (
                  <>
                    <NavLink to="/add-listing" onClick={close}
                      style={LINK_STYLE}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <FaPlus size={13} color="#6b7280" /> Add Listing
                    </NavLink>
                    <NavLink to="/dashboard/wallet" onClick={close}
                      style={{ ...LINK_STYLE, borderBottom: '1px solid #f3f4f6' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      💰 Earnings
                    </NavLink>
                  </>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '11px 16px', background: 'transparent', border: 'none',
                    color: '#ff5724', fontSize: 14, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: 10, fontWeight: 500, transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fff1ee')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <MdLogout size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hamburger Menu */}
      <button type="button" className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(o => !o)}>
        {menuOpen ? <IoCloseOutline size={20} /> : <IoMenuOutline size={20} />}
      </button>

      {/* Notifications Panel */}
      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </header>
  )
}
