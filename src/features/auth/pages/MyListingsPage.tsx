import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEdit, FaTrash, FaMapMarkerAlt, FaDollarSign, FaUsers, FaBed, FaShower } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function MyListingsPage() {
  const navigate = useNavigate()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMyListings()
      setListings(response.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load listings'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return

    try {
      await apiService.deleteListing(id)
      toast.success('Listing deleted successfully')
      loadListings()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete listing'
      toast.error(errorMessage)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading listings...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>My Listings</h2>
        <button
          onClick={() => navigate('/dashboard/add-listing')}
          style={{
            padding: '10px 20px',
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
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>No listings yet</p>
          <button
            onClick={() => navigate('/dashboard/add-listing')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff385c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {listings.map((listing) => (
            <div
              key={listing.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '200px 1fr auto',
                gap: '20px',
                alignItems: 'center'
              }}
            >
              {/* Image */}
              <div style={{ height: '150px', overflow: 'hidden' }}>
                <img
                  src={listing.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                  alt={listing.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Details */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                  {listing.title}
                </h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt size={14} color="#ff385c" />
                    {listing.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaDollarSign size={14} color="#ff385c" />
                    ${listing.pricePerNight} per night
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                    {listing.bedrooms && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaBed size={12} /> {listing.bedrooms} bed
                      </span>
                    )}
                    {listing.bathrooms && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaShower size={12} /> {listing.bathrooms} bath
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaUsers size={12} /> {listing.guests} guests
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '20px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <button
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
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
                  <FaEdit size={12} /> View
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
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
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
