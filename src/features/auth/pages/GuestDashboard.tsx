import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaCheckCircle, FaClock, FaHeart } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function GuestDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalBookings: 0, confirmedBookings: 0, pendingBookings: 0, savedListings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      const bookings = await apiService.getMyBookings()
      setStats({
        totalBookings: bookings.data?.length || 0,
        confirmedBookings: bookings.data?.filter((b: any) => b.status === 'CONFIRMED').length || 0,
        pendingBookings: bookings.data?.filter((b: any) => b.status === 'PENDING').length || 0,
        savedListings: 0,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: <FaCalendarAlt size={22} color="#6366f1" /> },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: <FaCheckCircle size={22} color="#22c55e" /> },
    { label: 'Pending', value: stats.pendingBookings, icon: <FaClock size={22} color="#f59e0b" /> },
    { label: 'Saved Listings', value: stats.savedListings, icon: <FaHeart size={22} color="#ff5724" /> },
  ]

  return (
    <>
      {/* Banner */}
      <div className="db-banner">
        <div className="db-banner__content">
          <div className="db-banner__icon">✈️</div>
          <div>
            <p className="db-banner__title">Welcome back! 👋</p>
            <p className="db-banner__desc">Explore new places, manage your bookings and plan your next adventure.</p>
            <button className="db-banner__btn" onClick={() => navigate('/listings')}>Browse Listings</button>
          </div>
        </div>
        <div className="db-banner__illustration">🌍</div>
      </div>

      {/* Stat Cards */}
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

      {/* Quick Actions */}
      <div className="db-metrics">
        {[
          { label: 'My Bookings', desc: 'View all your upcoming and past trips', btn: 'View Bookings', path: '/dashboard/bookings' },
          { label: 'Messages', desc: 'Chat with hosts about your stays', btn: 'View Messages', path: '/dashboard/messages' },
          { label: 'Explore', desc: 'Discover new listings around the world', btn: 'Browse Listings', path: '/listings' },
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
