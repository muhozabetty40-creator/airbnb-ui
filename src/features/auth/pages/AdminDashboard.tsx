import { useNavigate } from 'react-router-dom'
import { FaUsers, FaList, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const statCards = [
    { label: 'Total Users', value: '—', icon: <FaUsers size={22} color="#6366f1" /> },
    { label: 'Total Listings', value: '—', icon: <FaList size={22} color="#ff5724" /> },
    { label: 'Total Bookings', value: '—', icon: <FaCalendarAlt size={22} color="#22c55e" /> },
    { label: 'Admin Panel', value: '✓', icon: <FaShieldAlt size={22} color="#f59e0b" /> },
  ]

  return (
    <>
      <div className="db-banner">
        <div className="db-banner__content">
          <div className="db-banner__icon">🛡️</div>
          <div>
            <p className="db-banner__title">Admin Control Panel</p>
            <p className="db-banner__desc">Manage users, listings and bookings across the entire platform.</p>
          </div>
        </div>
        <div className="db-banner__illustration">⚙️</div>
      </div>

      <div className="db-stats">
        {statCards.map(card => (
          <div key={card.label} className="db-stat-card">
            <div>
              <p className="db-stat-card__label">{card.label}</p>
              <p className="db-stat-card__value">{card.value}</p>
            </div>
            <div className="db-stat-card__icon">{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="db-metrics">
        {[
          { label: 'Users', desc: 'View and manage all registered users', btn: 'Manage Users', path: '/dashboard/users' },
          { label: 'All Bookings', desc: 'Monitor and manage all bookings', btn: 'View Bookings', path: '/dashboard/admin-bookings' },
          { label: 'All Listings', desc: 'Review and moderate all listings', btn: 'View Listings', path: '/dashboard/admin-listings' },
        ].map(item => (
          <div key={item.label} className="db-metric">
            <div className="db-metric__header">
              <span className="db-metric__label">{item.label}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{item.desc}</p>
            <button className="db-btn db-btn--outline" onClick={() => navigate(item.path)}>{item.btn}</button>
          </div>
        ))}
      </div>
    </>
  )
}
