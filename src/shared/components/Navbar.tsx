import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BiUserPlus } from 'react-icons/bi'
import { BsMoon } from 'react-icons/bs'
import { IoAddOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { MdLogout } from 'react-icons/md'
import { useFavorites } from '../../features/listings/hooks/useFavorites'
import { useStore } from '../../store/StoreContext'
import { useAuth } from '../../features/auth/hooks/useAuth'
import SavedListings from '../../features/listings/components/SavedListings'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { count } = useFavorites()
  const { dispatch } = useStore()
  const { isAuthenticated, logout, email } = useAuth()
  const navigate = useNavigate()
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/login')
  }

  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <span className="brand-logo">List</span>
        <span className="brand-highlight">On</span>
      </NavLink>

      <nav className={`site-nav${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive && location.pathname === '/' ? 'nav-active' : ''}>Home</NavLink>
        <NavLink to="/listings" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-active' : ''}>Listing</NavLink>
        <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-active' : ''}>Dashboard</NavLink>
        {!isAuthenticated && (
          <NavLink to="/login" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-active' : ''}>Login</NavLink>
        )}
      </nav>

      <div className="top-actions">
        <div className="fav-wrap">
          <button type="button" className="icon-button" aria-label="Favorites" onClick={() => setFavOpen(o => !o)}>
            {count > 0 ? <AiFillHeart size={18} color="#ff385c" /> : <AiOutlineHeart size={18} />}
            <span className="badge">{count}</span>
          </button>
          <SavedListings open={favOpen} onClose={() => setFavOpen(false)} />
        </div>
        <button type="button" className="icon-button" aria-label="User invite"><BiUserPlus size={18} /></button>
        <button type="button" className="icon-button" aria-label="Toggle theme"><BsMoon size={18} /></button>

        {isAuthenticated && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="icon-button"
              aria-label="Profile"
              onClick={() => setProfileOpen(o => !o)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ff385c',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {email?.[0]?.toUpperCase() || 'U'}
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minWidth: '220px',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{email}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                    {user?.role === 'HOST' ? '🏠 Host' : '👤 Guest'}
                  </p>
                </div>

                <NavLink
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    fontSize: '14px',
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  My Profile
                </NavLink>

                {user?.role === 'HOST' && (
                  <NavLink
                    to="/add-listing"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      color: '#333',
                      textDecoration: 'none',
                      fontSize: '14px',
                      borderBottom: '1px solid #e0e0e0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Add Listing
                  </NavLink>
                )}

                <button
                  type="button"
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
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MdLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button type="button" className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(o => !o)}>
        {menuOpen ? <IoCloseOutline size={20} /> : <IoMenuOutline size={20} />}
      </button>
    </header>
  )
}
