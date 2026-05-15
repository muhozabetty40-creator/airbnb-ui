import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaHome, FaCalendarAlt, FaDollarSign, FaChartLine } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function HostDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalListings: 0,
    totalBookings: 0,
    totalEarnings: 0,
    pendingBookings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [listings, bookings] = await Promise.all([
        apiService.getMyListings(),
        apiService.getMyBookings()
      ])

      const totalEarnings = bookings.data?.reduce((sum: number, b: any) => sum + (b.total || 0), 0) || 0
      const pendingBookings = bookings.data?.filter((b: any) => b.status === 'PENDING').length || 0

      setStats({
        totalListings: listings.data?.length || 0,
        totalBookings: bookings.data?.length || 0,
        totalEarnings,
        pendingBookings
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
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Host Dashboard</h2>

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
            <FaHome size={32} />
            <div>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Total Listings
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>
                {stats.totalListings}
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
            <FaCalendarAlt size={32} color="#ff385c" />
            <div>
              <p style={{ fontSize: '12px', color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Total Bookings
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', color: '#1a1a1a' }}>
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
            <FaDollarSign size={32} color="#22c55e" />
            <div>
              <p style={{ fontSize: '12px', color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Total Earnings
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', color: '#22c55e' }}>
                ${stats.totalEarnings.toFixed(2)}
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
            <FaChartLine size={32} color="#ff9800" />
            <div>
              <p style={{ fontSize: '12px', color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>
                Pending Bookings
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0', color: '#ff9800' }}>
                {stats.pendingBookings}
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
            onClick={() => navigate('/add-listing')}
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
            + Add New Listing
          </button>
          <button
            onClick={() => navigate('/dashboard/listings')}
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
            View My Listings
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
            View Bookings
          </button>
          <button
            onClick={() => navigate('/dashboard/wallet')}
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
            View Earnings
          </button>
        </div>
      </div>
    </div>
  )
}
