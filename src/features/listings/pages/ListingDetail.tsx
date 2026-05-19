import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaShower, FaUsers,
  FaCalendarAlt, FaCheck, FaHeart, FaRegHeart, FaStar, FaWifi
} from 'react-icons/fa'
import { useAuth } from '../../auth/hooks/useAuth'
import { apiService } from '../../../api'
import { useFavorites } from '../hooks/useFavorites'

const INPUT: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box'
}

const TYPE_EMOJI: Record<string, string> = { APARTMENT: '🏢', HOUSE: '🏠', VILLA: '🏰', CABIN: '🏕️' }

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()
  const { toggleApi, isApiSaved } = useFavorites()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: '1' })

  useEffect(() => {
    if (!id) return
    apiService.getListingById(id)
      .then(r => setListing(r))
      .catch(e => toast.error(e instanceof Error ? e.message : 'Failed to load listing'))
      .finally(() => setLoading(false))
  }, [id])

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0
    return Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
  })()

  const subtotal = listing ? nights * listing.pricePerNight : 0
  const serviceFee = subtotal * 0.1
  const total = subtotal + serviceFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to book'); navigate('/login'); return }
    if (role !== 'GUEST') { toast.error('Only guests can book listings'); return }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (listing?.userId === user.id) { toast.error('You cannot book your own listing'); return }
    if (!form.checkIn || !form.checkOut) { toast.error('Select check-in and check-out dates'); return }
    const checkIn = new Date(form.checkIn), checkOut = new Date(form.checkOut), today = new Date()
    today.setHours(0, 0, 0, 0)
    if (checkIn < today) { toast.error('Check-in cannot be in the past'); return }
    if (checkOut <= checkIn) { toast.error('Check-out must be after check-in'); return }
    if (Number(form.guests) > listing.guests) { toast.error(`Max ${listing.guests} guests`); return }
    try {
      setBookingLoading(true)
      await apiService.createBooking({ listingId: id!, checkIn: form.checkIn, checkOut: form.checkOut, guests: Number(form.guests), total })
      toast.success('Booking confirmed!')
      navigate('/dashboard/bookings')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '80px 20px', textAlign: 'center', color: '#9ca3af' }}>Loading property...</div>

  if (!listing) return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <p style={{ fontSize: 18, color: '#374151', marginBottom: 20 }}>Property not found.</p>
      <button onClick={() => navigate('/listings')} style={{ padding: '10px 24px', background: '#ff5724', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
        Back to Listings
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>

      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', cursor: 'pointer', marginBottom: 24, fontWeight: 500 }}>
        <FaArrowLeft size={12} /> Back
      </button>

      {/* Hero image */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 420, marginBottom: 36, background: '#f3f4f6' }}>
        <img
          src={listing.image || 'https://placehold.co/1200x420?text=No+Image'}
          alt={listing.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.src = 'https://placehold.co/1200x420?text=No+Image' }}
        />
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
        {/* Type badge */}
        <span style={{ position: 'absolute', top: 20, left: 20, background: '#ff5724', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>
          {TYPE_EMOJI[listing.type] || ''} {listing.type}
        </span>
        {/* Like */}
        <button
          onClick={() => listing && toggleApi({ id: listing.id, title: listing.title, location: listing.location, pricePerNight: listing.pricePerNight, rating: listing.rating, image: listing.image, type: listing.type, guests: listing.guests, bedrooms: listing.bedrooms, bathrooms: listing.bathrooms })}
          style={{ position: 'absolute', top: 20, right: 20, width: 42, height: 42, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          {isApiSaved(listing?.id) ? <FaHeart size={18} color="#ff5724" /> : <FaRegHeart size={18} color="#9ca3af" />}
        </button>
        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{listing.title}</h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaMapMarkerAlt size={12} /> {listing.location}
            <span style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaStar size={12} color="#f59e0b" /> {listing.rating?.toFixed(1) || '4.5'} · {listing.reviews || 0} reviews
            </span>
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>

        {/* ── Left ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { icon: <FaUsers size={18} color="#ff5724" />, label: 'Guests', value: `${listing.guests} max` },
              { icon: <FaBed size={18} color="#6366f1" />, label: 'Bedrooms', value: listing.bedrooms ?? '—' },
              { icon: <FaShower size={18} color="#22c55e" />, label: 'Bathrooms', value: listing.bathrooms ?? '—' },
              { icon: <span style={{ fontSize: 18 }}>{TYPE_EMOJI[listing.type] || '🏠'}</span>, label: 'Type', value: listing.type },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 14, padding: '16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{item.icon}</div>
                <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: '#111827' }}>About this property</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#6b7280' }}>{listing.description}</p>
          </div>

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#111827' }}>Amenities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {listing.amenities.map((a: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff1ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FaCheck size={11} color="#ff5724" />
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right — Booking card ── */}
        {role === 'GUEST' ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '28px', position: 'sticky', top: 80, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* Price */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>Price per night</p>
            <p style={{ margin: '4px 0 0', fontSize: 30, fontWeight: 800, color: '#111827' }}>
              <span style={{ color: '#ff5724' }}>${listing.pricePerNight}</span>
              <span style={{ fontSize: 14, fontWeight: 400, color: '#9ca3af' }}> / night</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                <FaCalendarAlt size={11} color="#ff5724" /> Check-in
              </label>
              <input type="date" name="checkIn" value={form.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
                style={INPUT} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                <FaCalendarAlt size={11} color="#ff5724" /> Check-out
              </label>
              <input type="date" name="checkOut" value={form.checkOut}
                min={form.checkIn || new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                style={INPUT} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                <FaUsers size={11} color="#ff5724" /> Guests
              </label>
              <select value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} style={INPUT}>
                {Array.from({ length: listing.guests }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            {/* Price breakdown */}
            {nights > 0 && (
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280' }}>
                  <span>${listing.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280' }}>
                  <span>Service fee (10%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#111827', borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 4 }}>
                  <span>Total</span>
                  <span style={{ color: '#ff5724' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={bookingLoading || !form.checkIn || !form.checkOut}
              style={{
                padding: '13px', background: '#ff5724', color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: (bookingLoading || !form.checkIn || !form.checkOut) ? 'not-allowed' : 'pointer',
                opacity: (bookingLoading || !form.checkIn || !form.checkOut) ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4
              }}
            >
              <FaCheck size={13} /> {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
            </button>

            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
              You won't be charged until booking is confirmed
            </p>
          </form>
        </div>
        ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '28px', position: 'sticky', top: 80, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Only guests can book listings</p>
        </div>
        )}
      </div>
    </div>
  )
}
