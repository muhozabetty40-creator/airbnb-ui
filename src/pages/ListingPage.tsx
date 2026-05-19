import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaMapMarkerAlt, FaFilter, FaStar, FaBed, FaShower, FaUsers, FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa'
import { apiService } from '../api'
import { useFavorites } from '../features/listings/hooks/useFavorites'

const TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'CABIN']

export default function ListingPage() {
  const navigate = useNavigate()
  const { toggleApi, isApiSaved } = useFavorites()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)

  useEffect(() => {
    apiService.getListings(1, 100)
      .then(r => setListings(r.data || []))
      .catch(e => toast.error(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const toggleType = (t: string) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const toggleLike = (e: React.MouseEvent, listing: any) => {
    e.stopPropagation()
    toggleApi({ id: listing.id, title: listing.title, location: listing.location, pricePerNight: listing.pricePerNight, rating: listing.rating, image: listing.image, type: listing.type, guests: listing.guests, bedrooms: listing.bedrooms, bathrooms: listing.bathrooms })
  }

  const clearFilters = () => {
    setSearch(''); setLocation(''); setSelectedTypes([]); setMinPrice(0); setMaxPrice(10000)
  }

  const filtered = listings.filter(l => {
    const q = search.toLowerCase()
    return (
      (!search || l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)) &&
      (!location || l.location?.toLowerCase().includes(location.toLowerCase())) &&
      (!selectedTypes.length || selectedTypes.includes(l.type)) &&
      l.pricePerNight >= minPrice && l.pricePerNight <= maxPrice
    )
  })

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 61px)', background: '#f7f8fa' }}>

      {/* ── Fixed Sidebar ── */}
      <aside style={{
        width: 260, flexShrink: 0, background: '#fff', borderRight: '1px solid #e5e7eb',
        position: 'fixed', top: 61, left: 0, bottom: 0,
        overflowY: 'auto', padding: '24px 20px',
        display: 'flex', flexDirection: 'column', gap: 28,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#111827' }}>
            <FaFilter size={14} color="#ff5724" /> Filters
          </span>
          <button onClick={clearFilters} style={{ background: 'none', border: 'none', fontSize: 12, color: '#ff5724', cursor: 'pointer', fontWeight: 600 }}>
            Clear all
          </button>
        </div>

        {/* Search */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Search</p>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Title or description..."
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Location */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Location</p>
          <div style={{ position: 'relative' }}>
            <FaMapMarkerAlt size={12} color="#ff5724" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={location} onChange={e => setLocation(e.target.value)}
              placeholder="City or country..."
              style={{ width: '100%', padding: '9px 12px 9px 28px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Price range */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Price / Night</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
            <span>${minPrice}</span><span>${maxPrice}</span>
          </div>
          <input type="range" min={0} max={10000} step={50} value={minPrice}
            onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice - 50))}
            style={{ width: '100%', accentColor: '#ff5724', marginBottom: 6 }} />
          <input type="range" min={0} max={10000} step={50} value={maxPrice}
            onChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice + 50))}
            style={{ width: '100%', accentColor: '#ff5724' }} />
        </div>

        {/* Property type */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Property Type</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TYPES.map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)}
                  style={{ width: 16, height: 16, accentColor: '#ff5724', cursor: 'pointer' }} />
                <span style={{ color: selectedTypes.includes(t) ? '#ff5724' : '#374151', fontWeight: selectedTypes.includes(t) ? 600 : 400 }}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, marginLeft: 260, padding: '28px 28px 48px', minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>All Listings</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>
              {loading ? 'Loading...' : `${filtered.length} propert${filtered.length === 1 ? 'y' : 'ies'} found`}
            </p>
          </div>
          {(search || location || selectedTypes.length > 0 || minPrice > 0 || maxPrice < 10000) && (
            <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#fee2e2', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}>
              <FaTimes size={11} /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9ca3af', fontSize: 15 }}>Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9ca3af', fontSize: 15 }}>No listings match your filters.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {filtered.map(listing => (
              <div
                key={listing.id}
                onClick={() => navigate(`/listings/${listing.id}`)}
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f3f4f6', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: 180, background: '#f3f4f6', overflow: 'hidden' }}>
                  <img
                    src={listing.image || 'https://placehold.co/400x180?text=No+Image'}
                    alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.currentTarget.src = 'https://placehold.co/400x180?text=No+Image' }}
                  />
                  {/* Type badge */}
                  <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                    {listing.type}
                  </span>
                  {/* Like button */}
                  <button
                    onClick={e => toggleLike(e, listing)}
                    style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                  >
                    {isApiSaved(listing.id) ? <FaHeart size={14} color="#ff5724" /> : <FaRegHeart size={14} color="#9ca3af" />}
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 16px 16px' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {listing.title}
                  </h3>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaMapMarkerAlt size={10} color="#ff5724" />{listing.location}
                  </p>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
                    {listing.bedrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FaBed size={11} />{listing.bedrooms} bed</span>}
                    {listing.bathrooms != null && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FaShower size={11} />{listing.bathrooms} bath</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FaUsers size={11} />{listing.guests}</span>
                  </div>

                  {/* Rating + price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                      <FaStar size={11} color="#f59e0b" />
                      {listing.rating?.toFixed(1) || '4.5'}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                      <span style={{ color: '#ff5724' }}>${listing.pricePerNight}</span>
                      <span style={{ fontSize: 11, fontWeight: 400, color: '#9ca3af' }}>/night</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
