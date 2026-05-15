import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaMapMarkerAlt, FaHome, FaUsers, FaBed, FaShower, FaCheck, FaCalendarAlt, FaDollarSign } from 'react-icons/fa'
import { useAuth } from '../features/auth/hooks/useAuth'
import { apiService } from '../api'

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState<any>(null)
  const [listingLoading, setListingLoading] = useState(true)
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1'
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (role !== 'GUEST') {
      toast.error('Only guests can book listings')
      navigate('/')
      return
    }

    const loadListing = async () => {
      try {
        if (!id) return
        const response = await apiService.getListingById(id)
        setListing(response)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load listing'
        toast.error(errorMessage)
        navigate('/')
      } finally {
        setListingLoading(false)
      }
    }

    loadListing()
  }, [id, isAuthenticated, role, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, nights)
  }

  const calculateTotal = () => {
    if (!listing) return 0
    const nights = calculateNights()
    return nights * listing.pricePerNight
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.checkIn || !formData.checkOut || !formData.guests) {
      toast.error('Please fill all required fields')
      return
    }

    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    
    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    if (Number(formData.guests) > listing.guests) {
      toast.error(`Maximum guests allowed: ${listing.guests}`)
      return
    }

    try {
      setLoading(true)
      await apiService.createBooking({
        listingId: id!,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests),
        total: calculateTotal()
      })
      toast.success('Booking confirmed! Check your dashboard for details.')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (listingLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading property details...</div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Property Not Found</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            backgroundColor: '#ff385c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Back to Listings
        </button>
      </div>
    )
  }

  const nights = calculateNights()
  const total = calculateTotal()

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '24px',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <FaArrowLeft size={12} /> Back to Listings
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Property Details */}
        <div>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{listing.title}</h1>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', fontSize: '16px', color: '#666', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaMapMarkerAlt size={14} color="#ff385c" /> {listing.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaHome size={14} color="#ff385c" /> {listing.type}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaUsers size={14} color="#ff385c" /> {listing.guests} guests
              </span>
            </div>
          </div>

          {/* Property Image */}
          {listing.image && (
            <div style={{ marginBottom: '40px' }}>
              <img
                src={listing.image}
                alt={listing.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>About this property</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666' }}>
              {listing.description}
            </p>
          </div>

          {/* Property Details Grid */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Property Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaHome size={20} color="#ff385c" />
                <div>
                  <p style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Type</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{listing.type}</p>
                </div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaUsers size={20} color="#ff385c" />
                <div>
                  <p style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Max Guests</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{listing.guests} people</p>
                </div>
              </div>
              {listing.bedrooms && (
                <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaBed size={20} color="#ff385c" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Bedrooms</p>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>{listing.bedrooms}</p>
                  </div>
                </div>
              )}
              {listing.bathrooms && (
                <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaShower size={20} color="#ff385c" />
                  <div>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Bathrooms</p>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>{listing.bathrooms}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Amenities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {listing.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCheck size={14} color="#ff385c" />
                    <span style={{ fontSize: '16px' }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '24px',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Price per night</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaDollarSign size={20} color="#ff385c" />
                <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{listing.pricePerNight}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Check-in */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  <FaCalendarAlt size={12} color="#ff385c" /> Check-in <span style={{ color: '#ff385c' }}>*</span>
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Check-out */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  <FaCalendarAlt size={12} color="#ff385c" /> Check-out <span style={{ color: '#ff385c' }}>*</span>
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Guests */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  <FaUsers size={12} color="#ff385c" /> Guests <span style={{ color: '#ff385c' }}>*</span>
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  {Array.from({ length: listing.guests }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              {formData.checkIn && formData.checkOut && nights > 0 && (
                <div style={{
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  padding: '16px 0',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>${listing.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>${(listing.pricePerNight * nights).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Service fee</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
                    <span>Total</span>
                    <span style={{ color: '#ff385c' }}>${(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.checkIn || !formData.checkOut}
                style={{
                  padding: '14px',
                  backgroundColor: '#ff385c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (loading || !formData.checkIn || !formData.checkOut) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !formData.checkIn || !formData.checkOut) ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                  marginTop: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                <FaCheck size={14} /> {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>

              <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '8px' }}>
                You won't be charged yet
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
