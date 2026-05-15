import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTimes, FaFilter } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'PAID'>('ALL')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMyBookings()
      setBookings(response.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bookings'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await apiService.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      loadBookings()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking'
      toast.error(errorMessage)
    }
  }

  const filteredBookings = statusFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter)

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading bookings...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>My Bookings</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FaFilter size={16} color="#ff385c" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} bookings</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '20px',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                  {booking.listing?.title || 'Listing'}
                </h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt size={14} color="#ff385c" />
                    {booking.listing?.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCalendarAlt size={14} color="#ff385c" />
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUsers size={14} color="#ff385c" />
                    {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '16px', fontWeight: '600', color: '#ff385c' }}>
                  ${booking.total}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: booking.status === 'CONFIRMED' ? '#d4edda' : booking.status === 'PAID' ? '#cfe2ff' : '#fff3cd',
                  color: booking.status === 'CONFIRMED' ? '#155724' : booking.status === 'PAID' ? '#084298' : '#856404',
                  textAlign: 'center'
                }}>
                  {booking.status}
                </span>
                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ff385c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaTimes size={12} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
