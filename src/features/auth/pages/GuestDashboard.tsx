import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaCheckCircle, FaClock, FaHeart } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function GuestDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    savedListings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const bookings = await apiService.getMyBookings()

      const confirmed = bookings.data?.filter((b: any) => b.status === 'CONFIRMED').length || 0
      const pending = bookings.data?.filter((b: any) => b.status === 'PENDING').length || 0

      setStats({
        totalBookings: bookings.data?.length || 0,
        confirmedBookings: confirmed,
        pendingBookings: pending,
        savedListings: 0
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stats'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Guest Dashboard</h2>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          backgroundColor: 'linear-gradient(135deg, #ff385c 0%, #e63946 100%)',
          backgroundImage: 'linear-gradient(135deg, #ff385c 0%, #e63946 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(255, 56, 92, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaCalendarAlt size={32} />
            <div>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Total Bookings
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>
                {stats.totalBookings}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaCheckCircle size={32} color="#22c55e" />
            <div>
              <p style={{ fontSize: '12px', color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Confirmed
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', color: '#22c55e' }}>
                {stats.confirmedBookings}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaClock size={32} color="#ff9800" />
            <div>
              <p style={{ fontSize: '12px', color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Pending
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', color: '#ff9800' }}>
                {stats.pendingBookings}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaHeart size={32} color="#ff385c" />
            <div>
              <p style={{ fontSize: '12px', color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Saved Listings
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', color: '#1a1a1a' }}>
                {stats.savedListings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button
            onClick={() => navigate('/listings')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#ff385c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Browse Listings
          </button>
          <button
            onClick={() => navigate('/dashboard/bookings')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            My Bookings
          </button>
          <button
            onClick={() => navigate('/dashboard/messages')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Messages
          </button>
        </div>
      </div>
    </div>
  )
}
