import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await apiService.getReviews()
      setReviews(response.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reviews'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reviews...</div>
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Reviews</h2>

      {reviews.length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Average Rating</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#ff385c' }}>
                {averageRating}
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    color={i < Math.round(Number(averageRating)) ? '#ff385c' : '#ddd'}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Total Reviews</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
              {reviews.length}
            </p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>No reviews yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ff385c',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {review.guest?.name?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      {review.guest?.name || 'Guest'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>
                      {review.guest?.email}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      color={i < review.rating ? '#ff385c' : '#ddd'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', lineHeight: '1.6' }}>
                {review.comment}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#999' }}>
                <FaCalendarAlt size={12} />
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
