import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaHome, FaCalendarAlt, FaDollarSign, FaChartLine, FaEdit, FaTrash, FaMapMarkerAlt, FaBed, FaShower, FaUsers, FaTimes, FaCheck, FaEye, FaPlus } from 'react-icons/fa'
import { apiService } from '../../../api'

interface Listing {
  id: string
  title: string
  location: string
  pricePerNight: number
  guests: number
  bedrooms?: number
  bathrooms?: number
  type: string
  image?: string
  amenities?: string[]
  description?: string
}

const INPUT_STYLE: React.CSSProperties = {
  padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
  fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit'
}

export default function HostDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalListings: 0, totalBookings: 0, totalEarnings: 0, pendingBookings: 0 })
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [editListing, setEditListing] = useState<Listing | null>(null)
  const [editForm, setEditForm] = useState<Partial<Listing>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [listingsRes, bookingsRes] = await Promise.all([apiService.getMyListings(), apiService.getMyBookings()])
      const listingsData: Listing[] = listingsRes.data || []
      const bookingsData = bookingsRes.data || []
      setListings(listingsData)
      setStats({
        totalListings: listingsData.length,
        totalBookings: bookingsData.length,
        totalEarnings: bookingsData.reduce((sum: number, b: any) => sum + (b.total || 0), 0),
        pendingBookings: bookingsData.filter((b: any) => b.status === 'PENDING').length,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (listing: Listing) => {
    setEditListing(listing)
    setEditForm({
      title: listing.title,
      location: listing.location,
      pricePerNight: listing.pricePerNight,
      guests: listing.guests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      type: listing.type,
      description: listing.description || '',
      amenities: listing.amenities,
    })
  }

  const handleEditSave = async () => {
    if (!editListing) return
    try {
      setSaving(true)
      await apiService.updateListing(editListing.id, {
        title: editForm.title,
        location: editForm.location,
        pricePerNight: Number(editForm.pricePerNight),
        guests: Number(editForm.guests),
        bedrooms: editForm.bedrooms ? Number(editForm.bedrooms) : undefined,
        bathrooms: editForm.bathrooms ? Number(editForm.bathrooms) : undefined,
        type: editForm.type,
        description: editForm.description,
        amenities: typeof editForm.amenities === 'string'
          ? (editForm.amenities as string).split(',').map((a: string) => a.trim())
          : editForm.amenities,
      })
      toast.success('Listing updated!')
      setEditListing(null)
      loadData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update listing')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      setDeleting(id)
      await apiService.deleteListing(id)
      toast.success('Listing deleted')
      loadData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete listing')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>

  const statCards = [
    { label: 'Total Listings', value: stats.totalListings, icon: <FaHome size={22} color="#ff5724" /> },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <FaCalendarAlt size={22} color="#6366f1" /> },
    { label: 'Total Earnings', value: `$${stats.totalEarnings.toFixed(2)}`, icon: <FaDollarSign size={22} color="#22c55e" /> },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: <FaChartLine size={22} color="#f59e0b" /> },
  ]

  return (
    <>
      {/* Banner */}
      <div className="db-banner">
        <div className="db-banner__content">
          <div>
            <p className="db-banner__title">Welcome back, Host! 👋</p>
            <p className="db-banner__desc">Manage your listings, track bookings and monitor your earnings all in one place.</p>
            <button className="db-banner__btn" onClick={() => navigate('/dashboard/add-listing')}>
              <FaPlus size={11} style={{ marginRight: 6 }} />Add New Listing
            </button>
          </div>
        </div>
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

      {/* Listings Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>My Listings</p>
          <button
            onClick={() => navigate('/add-listing')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#ff5724', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <FaPlus size={11} /> Add Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 16px' }}>No listings yet. Create your first one!</p>
            <button onClick={() => navigate('/add-listing')} className="db-btn db-btn--outline">+ Create Listing</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Image', 'Title', 'Location', 'Type', 'Price/Night', 'Guests', 'Beds/Baths', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, i) => (
                  <tr key={listing.id} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img
                        src={listing.image || 'https://placehold.co/56x40?text=No+Img'}
                        alt={listing.title}
                        style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827', maxWidth: 180 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaMapMarkerAlt size={11} color="#ff5724" />{listing.location}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#fff1ee', color: '#ff5724', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {listing.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111827' }}>${listing.pricePerNight}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaUsers size={11} />{listing.guests}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {listing.bedrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FaBed size={11} />{listing.bedrooms}</span>}
                        {listing.bathrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FaShower size={11} />{listing.bathrooms}</span>}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          title="View"
                          style={{ padding: '6px 10px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center' }}
                        >
                          <FaEye size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(listing)}
                          title="Edit"
                          style={{ padding: '6px 10px', background: '#eff6ff', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center' }}
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          title="Delete"
                          disabled={deleting === listing.id}
                          style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editListing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Edit Listing</p>
              <button onClick={() => setEditListing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Title', key: 'title', type: 'text' },
                { label: 'Location', key: 'location', type: 'text' },
                { label: 'Price per Night ($)', key: 'pricePerNight', type: 'number' },
                { label: 'Max Guests', key: 'guests', type: 'number' },
                { label: 'Bedrooms', key: 'bedrooms', type: 'number' },
                { label: 'Bathrooms', key: 'bathrooms', type: 'number' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={(editForm as any)[field.key] ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))}
                    style={INPUT_STYLE}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Property Type</label>
                <select
                  value={editForm.type || 'APARTMENT'}
                  onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                  style={INPUT_STYLE}
                >
                  {['APARTMENT', 'HOUSE', 'VILLA', 'CABIN'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editForm.amenities) ? editForm.amenities.join(', ') : (editForm.amenities || '')}
                  onChange={e => setEditForm(f => ({ ...f, amenities: e.target.value as any }))}
                  placeholder="WiFi, Pool, Parking"
                  style={INPUT_STYLE}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: 10, padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
              <button
                onClick={handleEditSave}
                disabled={saving}
                style={{ flex: 1, padding: '10px', background: '#ff5724', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <FaCheck size={13} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditListing(null)}
                className="db-btn db-btn--outline"
                style={{ padding: '10px 20px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
