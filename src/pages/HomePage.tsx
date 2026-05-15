import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaMapMarkerAlt, FaBed, FaShower, FaUsers, FaArrowRight, FaHome, FaUsers as FaUsersGroup, FaGlobeAmericas, FaHeart } from 'react-icons/fa'
import { apiService } from '../api'

export default function HomePage() {
  const navigate = useNavigate()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1600&h=900&fit=crop'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setLoading(false)
      const response = await apiService.getListings(1, 12)
      setListings(response.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load listings'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const featuredListings = listings.slice(0, 6)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '600px',
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
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
          <p
            style={{
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '2px',
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}
          >
            WE ARE #1 ON THE MARKET
          </p>

          <h1
            style={{
              fontSize: '72px',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}
          >
            We're Here To Help You
          </h1>

          <p
            style={{
              fontSize: '56px',
              fontWeight: '400',
              marginBottom: '40px',
              lineHeight: '1.2'
            }}
          >
            <span style={{ fontStyle: 'italic', textDecoration: 'underline', textDecorationColor: '#ff385c', textDecorationThickness: '4px' }}>
              Navigate
            </span>
            {' '}While Traveling
          </p>

          <button
            onClick={() => navigate('/listings')}
            style={{
              padding: '16px 40px',
              backgroundColor: '#ff385c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e63946'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff385c'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <FaArrowRight size={14} /> Explore Now
          </button>
        </div>

        {/* Image Carousel Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
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

      {/* Featured Listings Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 20px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '14px', color: '#ff385c', fontWeight: '600', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>
            FEATURED LISTINGS
          </p>
          <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', color: '#1a1a1a' }}>
            Discover Amazing Places
          </h2>
          <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Explore our handpicked collection of the finest properties from around the world
          </p>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Loading listings...</p>
          </div>
        ) : featuredListings.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              marginBottom: '60px'
            }}
          >
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => navigate(`/listings/${listing.id}`)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', height: '250px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/350x250?text=No+Image'
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

                  {/* Rating Badge */}
                  {listing.rating && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        backgroundColor: '#ff385c',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      ⭐ {listing.rating.toFixed(1)}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.success('Added to favorites!')
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <FaHeart size={18} color="#ff385c" />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1a1a1a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {listing.title}
                  </h3>

                  {/* Location */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaMapMarkerAlt size={14} color="#ff385c" /> {listing.location}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#999',
                      marginBottom: '16px',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {listing.description}
                  </p>

                  {/* Details */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    {listing.bedrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBed size={12} /> {listing.bedrooms} bed</span>}
                    {listing.bathrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaShower size={12} /> {listing.bathrooms} bath</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaUsers size={12} /> {listing.guests} guests</span>
                  </div>

                  {/* Price and Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#ff385c', margin: 0 }}>
                        ${listing.pricePerNight}
                      </p>
                      <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>
                        per night
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/listings/${listing.id}`)
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ff385c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e63946'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff385c'
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No listings available</p>
          </div>
        )}

        {/* View All Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/listings')}
            style={{
              padding: '16px 40px',
              backgroundColor: 'transparent',
              color: '#ff385c',
              border: '2px solid #ff385c',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff385c'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#ff385c'
            }}
          >
            View All Listings <FaArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <FaHome size={48} color="#ff385c" />
              </div>
              <p style={{ fontSize: '48px', fontWeight: '700', color: '#ff385c', margin: '0 0 8px 0' }}>
                {listings.length}+
              </p>
              <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                Properties Listed
              </p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <FaUsersGroup size={48} color="#ff385c" />
              </div>
              <p style={{ fontSize: '48px', fontWeight: '700', color: '#ff385c', margin: '0 0 8px 0' }}>
                50K+
              </p>
              <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                Happy Guests
              </p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <FaGlobeAmericas size={48} color="#ff385c" />
              </div>
              <p style={{ fontSize: '48px', fontWeight: '700', color: '#ff385c', margin: '0 0 8px 0' }}>
                100+
              </p>
              <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                Cities Worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
          Ready to List Your Property?
        </h2>
        <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Join thousands of hosts and start earning today. It's easy, fast, and secure.
        </p>
        <button
          onClick={() => navigate('/add-listing')}
          style={{
            padding: '16px 40px',
            backgroundColor: '#ff385c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e63946'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff385c'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <FaHome size={16} /> Create Your First Listing
        </button>
      </div>
    </div>
  )
}
