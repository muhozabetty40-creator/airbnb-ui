import { useMemo, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../store/StoreContext'
import { useListings } from '../hooks/useListings'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import Spinner from '../../../shared/components/Spinner'

export default function ListingsPage() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [savedOnly, setSavedOnly] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchLocation, setSearchLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  useListings()

  const heroImages = [
    'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&h=500&fit=crop'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const filtered = useMemo(() => {
    const q = state.filter.toLowerCase()
    return state.listings
      .filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))
      .filter(l => (savedOnly ? state.saved.includes(l.id) : true))
  }, [state.listings, state.filter, state.saved, savedOnly])

  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), [dispatch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchLocation || searchQuery) {
      navigate(`/listings?location=${searchLocation}&query=${searchQuery}`)
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '500px',
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            maxWidth: '900px',
            padding: '0 20px'
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}
          >
            Just Input Your Location & Find
          </h1>
          <p
            style={{
              fontSize: '42px',
              fontWeight: '400',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}
          >
            <span style={{ fontStyle: 'italic', textDecoration: 'underline', textDecorationColor: '#ff385c', textDecorationThickness: '3px' }}>
              Important &
            </span>
            {' '}Exciting Spots
          </p>
          <p
            style={{
              fontSize: '16px',
              color: '#e0e0e0',
              marginBottom: '40px'
            }}
          >
            You'll get comprehensive results based on the provided location
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              gap: '0',
              backgroundColor: 'white',
              borderRadius: '50px',
              padding: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            {/* Search Type Dropdown */}
            <button
              type="button"
              style={{
                padding: '12px 24px',
                backgroundColor: '#ff385c',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Search places
              <span>▼</span>
            </button>

            {/* Location Input */}
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                padding: '12px 20px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            />

            {/* Query Input */}
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                padding: '12px 20px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            />

            {/* Search Button */}
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              🔍
            </button>
          </form>
        </div>

        {/* Image Carousel Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 2
          }}
        >
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: idx === currentImageIndex ? '#ff385c' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Listings Section */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
            Popular Listings
          </h2>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Discover amazing places to stay
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <SearchBar />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            <input 
              type="checkbox" 
              checked={savedOnly} 
              onChange={e => setSavedOnly(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Saved only
          </label>
          <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
            {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
          </span>
          <button 
            type="button" 
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            Clear All
          </button>
        </div>

        {/* Listings Grid */}
        {state.loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No listings match your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '60px 20px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#1a1a1a' }}>
          Ready to List Your Property?
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
          Join thousands of hosts and start earning today
        </p>
        <button
          onClick={() => navigate('/add-listing')}
          style={{
            padding: '14px 32px',
            backgroundColor: '#ff385c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Create Your First Listing
        </button>
      </div>
    </main>
  )
}
