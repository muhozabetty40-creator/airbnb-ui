import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTimes,
  FaCheckCircle, FaClock, FaBan, FaEye, FaMoneyBillWave, FaCheck
} from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../../../api'

type Status = 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDING:   { label: 'Pending',   color: '#92400e', bg: '#fef3c7', icon: <FaClock size={11} />        },
  CONFIRMED: { label: 'Confirmed', color: '#065f46', bg: '#d1fae5', icon: <FaCheckCircle size={11} />  },
  PAID:      { label: 'Paid',      color: '#1e40af', bg: '#dbeafe', icon: <FaMoneyBillWave size={11} /> },
  CANCELLED: { label: 'Cancelled', color: '#991b1b', bg: '#fee2e2', icon: <FaBan size={11} />          },
}

const fmt = (d: string) => {
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return d }
}

// normalise status to uppercase so it always matches STATUS_CONFIG keys
const normalise = (b: any) => ({ ...b, status: (b.status || 'PENDING').toUpperCase() })

export default function BookingsPage() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<Status>('ALL')
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await apiService.getMyBookings()
      // handle both { data: [] } and [] and { bookings: [] }
      const raw: any[] = Array.isArray(res) ? res : (res.data ?? res.bookings ?? [])
      setBookings(raw.map(normalise))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const cancel = async (id: string) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      setCancelling(id)
      await apiService.cancelBooking(id)
      toast.success('Booking cancelled')
      load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to cancel')
    } finally {
      setCancelling(null)
    }
  }

  const approve = async (id: string) => {
    if (!window.confirm('Approve this booking?')) return
    try {
      setApproving(id)
      await apiService.approveBooking(id)
      toast.success('Booking approved')
      load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to approve')
    } finally {
      setApproving(null)
    }
  }

  const counts: Record<Status, number> = {
    ALL:       bookings.length,
    PENDING:   bookings.filter(b => b.status === 'PENDING').length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    PAID:      bookings.filter(b => b.status === 'PAID').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  const filtered = active === 'ALL' ? bookings : bookings.filter(b => b.status === active)

  const tabs: { key: Status; label: string }[] = [
    { key: 'ALL',       label: 'All'       },
    { key: 'PENDING',   label: 'Pending'   },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PAID',      label: 'Paid'      },
    { key: 'CANCELLED', label: 'Cancelled' },
  ]

  const statCards = [
    { label: 'Total Bookings', value: counts.ALL,       color: '#6366f1', icon: <FaCalendarAlt size={20} color="#6366f1" /> },
    { label: 'Pending',        value: counts.PENDING,   color: '#f59e0b', icon: <FaClock size={20} color="#f59e0b" />       },
    { label: 'Confirmed',      value: counts.CONFIRMED, color: '#22c55e', icon: <FaCheckCircle size={20} color="#22c55e" /> },
    { label: 'Cancelled',      value: counts.CANCELLED, color: '#ef4444', icon: <FaBan size={20} color="#ef4444" />         },
  ]

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: 15 }}>
      Loading bookings...
    </div>
  )

  return (
    <>
      {/* Banner */}
      <div className="db-banner">
        <div className="db-banner__content">
          <div>
            <p className="db-banner__title">My Bookings</p>
            <p className="db-banner__desc">Track all your upcoming and past reservations in one place.</p>
          </div>
        </div>
      </div>

      {/* Stat cards — counts derived from actual data */}
      <div className="db-stats">
        {statCards.map(s => (
          <div key={s.label} className="db-stat-card">
            <div>
              <p className="db-stat-card__label">{s.label}</p>
              <p className="db-stat-card__value" style={{ color: s.color }}>{s.value}</p>
            </div>
            <div className="db-stat-card__icon">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Tabs + list */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: active === tab.key ? 700 : 500,
                color: active === tab.key ? '#ff5724' : '#6b7280',
                borderBottom: active === tab.key ? '2px solid #ff5724' : '2px solid transparent',
                whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'color 0.15s'
              }}
            >
              {tab.label}
              <span style={{
                background: active === tab.key ? '#fff1ee' : '#f3f4f6',
                color: active === tab.key ? '#ff5724' : '#9ca3af',
                fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20, minWidth: 20, textAlign: 'center'
              }}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Booking rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
            No {active !== 'ALL' ? active.toLowerCase() : ''} bookings found.
          </div>
        ) : (
          <div>
            {filtered.map((booking, i) => {
              const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING
              // support both booking.listing and booking.listingId flat fields
              const listing = booking.listing ?? {}
              const image   = listing.image   ?? booking.listingImage   ?? null
              const title   = listing.title   ?? booking.listingTitle   ?? 'Listing'
              const location = listing.location ?? booking.listingLocation ?? '—'
              const listingId = listing.id ?? booking.listingId ?? null

              return (
                <div
                  key={booking.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr auto',
                    gap: 20,
                    padding: '18px 24px',
                    alignItems: 'center',
                    borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
                    background: i % 2 === 0 ? '#fff' : '#fafafa',
                    transition: 'background 0.15s'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={image || 'https://placehold.co/72x54?text=—'}
                    alt={title}
                    style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                    onError={e => { e.currentTarget.src = 'https://placehold.co/72x54?text=—' }}
                  />

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {title}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaMapMarkerAlt size={10} color="#ff5724" /> {location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaCalendarAlt size={10} color="#ff5724" />
                        {fmt(booking.checkIn)} → {fmt(booking.checkOut)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaUsers size={10} color="#ff5724" />
                        {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#ff5724' }}>
                      ${Number(booking.total ?? 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Status + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      color: cfg.color, background: cfg.bg, whiteSpace: 'nowrap'
                    }}>
                      {cfg.icon} {cfg.label}
                    </span>

                    <div style={{ display: 'flex', gap: 6 }}>
                      {listingId && (
                        <button
                          onClick={() => navigate(`/listings/${listingId}`)}
                          style={{ padding: '5px 10px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}
                        >
                          <FaEye size={11} /> View
                        </button>
                      )}
                      {role === 'HOST' && booking.status === 'PENDING' && (
                        <button
                          onClick={() => approve(booking.id)}
                          disabled={approving === booking.id}
                          style={{ padding: '5px 10px', background: '#d1fae5', border: 'none', borderRadius: 8, cursor: approving === booking.id ? 'not-allowed' : 'pointer', color: '#065f46', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, opacity: approving === booking.id ? 0.6 : 1 }}
                        >
                          <FaCheck size={11} /> {approving === booking.id ? '...' : 'Approve'}
                        </button>
                      )}
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <button
                          onClick={() => cancel(booking.id)}
                          disabled={cancelling === booking.id}
                          style={{ padding: '5px 10px', background: '#fee2e2', border: 'none', borderRadius: 8, cursor: cancelling === booking.id ? 'not-allowed' : 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, opacity: cancelling === booking.id ? 0.6 : 1 }}
                        >
                          <FaTimes size={11} /> {cancelling === booking.id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
