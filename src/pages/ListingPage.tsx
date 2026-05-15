import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaMapMarkerAlt, FaFilter, FaThLarge, FaList, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'
import { apiService } from '../api'

const CATEGORIES = [
  { name: 'Eat & Drink', count: 62 },
  { name: 'Coaching', count: 31 },
  { name: 'Apartments', count: 20 },
  { name: 'Services', count: 43 },
  { name: 'Classifieds', count: 16 },
  { name: 'Fitness', count: 22 },
  { name: 'Events', count: 21 }
]

export default function ListingPage() {
  const navigate = useNavigate()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPrice, setMinPrice] = useState(500)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [radius, setRadius] = useState(0.5)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setLoading(true)
      const response = await apiService.getListings(1, 50)
      setListings(response.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load listings'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !selectedLocation || listing.location.toLowerCase().includes(selectedLocation.toLowerCase())
    const matchesPrice = listing.pricePerNight >= minPrice && listing.pricePerNight <= maxPrice
    return matchesSearch && matchesLocation && matchesPrice
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Search Bar */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 150px 1fr 200px', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaMapMarkerAlt size={14} color="#ff385c" />
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value={0.5}>0.5 km</option>
              <option value={1}>1 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Select Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        
        {/* Sidebar */}
        <div>
          {/* Price Filter */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFilter size={16} color="#ff385c" /> Price Filter
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Select min and max price range
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              />
              <div style={{ padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '6px', fontSize: '13px', color: '#666' }}>
                $5 000
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '8px' }}
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
              Categories
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Duis a leo sit amet odio volutpat actor ut a lorem.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {CATEGORIES.map(category => (
                <label key={category.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === category.name}
                    onChange={(e) => setSelectedCategory(e.target.checked ? category.name : '')}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: '#1a1a1a', fontWeight: selectedCategory === category.name ? '600' : '400' }}>
                    {category.name}
                  </span>
                  <span style={{ color: '#999', fontSize: '13px' }}>
                    ({category.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Listings */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
              All <span style={{ fontWeight: '700' }}>{filteredListings.length}</span> listing found
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  width: '36px',
                  height: '36px',
                  border: viewMode === 'grid' ? '2px solid #ff385c' : '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'grid' ? '#fff5f7' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaThLarge size={16} color={viewMode === 'grid' ? '#ff385c' : '#999'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  width: '36px',
                  height: '36px',
                  border: viewMode === 'list' ? '2px solid #ff385c' : '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'list' ? '#fff5f7' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaList size={16} color={viewMode === 'list' ? '#ff385c' : '#999'} />
              </button>
            </div>
          </div>

          {/* Listings Grid/List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '16px', color: '#666' }}>Loading listings...</p>
            </div>
          ) : filteredListings.length > 0 ? (
            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : undefined,
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gap: '24px'
            }}>
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: viewMode === 'list' ? 'grid' : undefined,
                    gridTemplateColumns: viewMode === 'list' ? '300px 1fr' : undefined,
                    gap: viewMode === 'list' ? '20px' : undefined
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: viewMode === 'list' ? '250px' : '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                    {listing.image ? (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/350x200?text=No+Image'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#e0e0e0',
                        color: '#999',
                        fontSize: '14px'
                      }}>
                        No Image Available
                      </div>
                    )}

                    {/* Featured Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaStar size={12} /> Featured
                    </div>

                    {/* Discount Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      $100 off $399: eblwc
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toast.success('Added to favorites!')
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FaRegHeart size={18} color="#ff385c" />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: viewMode === 'list' ? '20px 0' : '16px' }}>
                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FaStar size={14} color="#ff385c" />
                      <span style={{ color: '#ff385c', fontSize: '16px', fontWeight: '600' }}>(4.5)</span>
                      <span style={{ color: '#ff385c', fontSize: '14px' }}>2,391 reviews</span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
                      {listing.title}
                      <span style={{ marginLeft: '8px', fontSize: '16px' }}>✓</span>
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '12px',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {listing.description}
                    </p>

                    {/* Contact Info */}
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666' }}>
                      <span>📞 (123) 456-7890</span>
                      <span style={{ cursor: 'pointer', color: '#ff385c' }}>📍 Directions</span>
                    </div>

                    {/* Price */}
                    {viewMode === 'list' && (
                      <div style={{ marginTop: '12px' }}>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: '#ff385c' }}>
                          ${listing.pricePerNight}
                        </p>
                        <p style={{ fontSize: '12px', color: '#999' }}>per night</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '16px', color: '#666' }}>No listings found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
