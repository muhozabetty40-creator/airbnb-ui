import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BsMoon } from 'react-icons/bs'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { MdLogout, MdDashboard } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { useFavorites } from '../../features/listings/hooks/useFavorites'
import { useAuth } from '../../features/auth/hooks/useAuth'
import SavedListings from '../../features/listings/components/SavedListings'

const LINK_STYLE = {
  display: 'block', padding: '11px 16px', color: '#374151',
  textDecoration: 'none', fontSize: '14px', transition: 'background 0.15s'
} as const

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { count } = useFavorites()
  const { isAuthenticated, logout, email, role } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isGuest = isAuthenticated && role === 'GUEST'
  const isHostOrAdmin = isAuthenticated && (role === 'HOST' || role === 'ADMIN')

  const roleLabel = role === 'HOST' ? '🏠 Host' : role === 'ADMIN' ? '🛡️ Admin' : '👤 Guest'
  const initials = email?.[0]?.toUpperCase() || 'U'

  // close dropdown on outside click
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

  const close = () => { setProfileOpen(false); setMenuOpen(false) }

  return (
    <header className="topbar">
      {/* Brand */}
      <NavLink to="/" className="brand">
        <span className="brand-logo">List</span>
        <span className="brand-highlight">On</span>
      </NavLink>

      {/* Nav links — hidden for host/admin */}
      {!isHostOrAdmin && (
        <nav className={`site-nav${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Home</NavLink>
          <NavLink to="/listings" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Listings</NavLink>
          {!isAuthenticated && (
            <NavLink to="/login" onClick={close} className={({ isActive }) => isActive ? 'nav-active' : ''}>Login</NavLink>
          )}
        </nav>
      )}

      {/* Right actions */}
      <div className="top-actions">
        <button type="button" className="icon-button" aria-label="Toggle theme"><BsMoon size={18} /></button>

        {/* Saved — guest only */}
        {isGuest && (
          <div className="fav-wrap">
            <button type="button" className="icon-button" aria-label="Saved" onClick={() => setFavOpen(o => !o)}>
              {count > 0 ? <AiFillHeart size={18} color="#ff385c" /> : <AiOutlineHeart size={18} />}
              <span className="badge">{count}</span>
            </button>
            <SavedListings open={favOpen} onClose={() => setFavOpen(false)} />
          </div>
        )}

        {/* Login button — logged out */}
        {!isAuthenticated && (
          <NavLink to="/login" className="action-button" style={{ textDecoration: 'none' }}>
            Login
          </NavLink>
        )}

        {/* Profile avatar + dropdown — logged in */}
        {isAuthenticated && (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: '#ff5724',
                color: '#fff', border: 'none', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {initials}
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 1000, overflow: 'hidden'
              }}>
                {/* User info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{email}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ca3af' }}>{roleLabel}</p>
                </div>

                {/* Profile */}
                <NavLink to="/profile" onClick={close}
                  style={LINK_STYLE}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaUser size={13} color="#6b7280" /> My Profile
                  </span>
                </NavLink>

                {/* Dashboard */}
                <NavLink to="/dashboard" onClick={close}
                  style={{ ...LINK_STYLE, borderBottom: '1px solid #f3f4f6' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MdDashboard size={14} color="#6b7280" /> Dashboard
                  </span>
                </NavLink>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '11px 16px', background: 'transparent', border: 'none',
                    color: '#ff5724', fontSize: 14, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: 10, fontWeight: 500
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

      {/* Hamburger — only when nav links are visible */}
      {!isHostOrAdmin && (
        <button type="button" className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <IoCloseOutline size={20} /> : <IoMenuOutline size={20} />}
        </button>
      )}
    </header>
  )
}
