import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaCamera, FaHome, FaMapMarkerAlt, FaDollarSign, FaUsers, FaBed, FaShower, FaTag, FaCheck, FaTimes } from 'react-icons/fa'
import { useAuth } from '../features/auth/hooks/useAuth'
import { apiService } from '../api'

export default function AddListingPage() {
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    guests: '',
    bedrooms: '',
    bathrooms: '',
    type: 'APARTMENT',
    amenities: '',
    image: null as File | null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews([reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.location || !formData.pricePerNight || !formData.guests) {
      toast.error('Please fill all required fields')
      return
    }

    if (!formData.image) {
      toast.error('Please upload an image')
      return
    }

    try {
      setLoading(true)
      let imageUrl = ''
      
      if (formData.image) {
        const uploadResult = await apiService.uploadAvatar(formData.image)
        imageUrl = uploadResult.url
      }

      await apiService.createListing({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        pricePerNight: Number(formData.pricePerNight),
        guests: Number(formData.guests),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        type: formData.type,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        image: imageUrl
      })
      toast.success('Listing created successfully!')
      navigate('/dashboard/listings')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create listing'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  if (role !== 'HOST') {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Only hosts can create listings.</p>
        <button
          onClick={() => navigate('/profile')}
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
          Go to Profile
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Main Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <FaHome size={28} color="#ff385c" />
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>
              Create a New Listing
            </h1>
          </div>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
            Share your property with thousands of potential guests
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          
          {/* Main Form */}
          <div>
            {/* Image Upload Section */}
            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCamera size={18} color="#ff385c" /> Property Image
              </h2>
              <label
                style={{
                  display: 'block',
                  border: '2px dashed #ddd',
                  borderRadius: '12px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: imagePreviews.length > 0 ? 'transparent' : '#fafafa',
                  transition: 'all 0.3s'
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.style.borderColor = '#ff385c'
                  e.currentTarget.style.backgroundColor = '#fff5f7'
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.backgroundColor = imagePreviews.length > 0 ? 'transparent' : '#fafafa'
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.backgroundColor = imagePreviews.length > 0 ? 'transparent' : '#fafafa'
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(file)
                    input.files = dataTransfer.files
                    handleImageChange({ target: input } as any)
                  }
                }}
              >
                {imagePreviews.length > 0 ? (
                  <div>
                    <img 
                      src={imagePreviews[0]} 
                      alt="Preview" 
                      style={{ maxHeight: '300px', marginBottom: '16px', borderRadius: '8px' }} 
                    />
                    <p style={{ color: '#666', marginBottom: '8px', fontSize: '14px' }}>Click or drag to change image</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                      <FaCamera size={48} color="#ff385c" />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a' }}>
                      Upload Property Image
                    </p>
                    <p style={{ color: '#999', fontSize: '14px' }}>Drag and drop or click to select (Max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Basic Information */}
            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaTag size={18} color="#ff385c" /> Basic Information
              </h2>

              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                  <FaHome size={14} color="#ff385c" /> Listing Title <span style={{ color: '#ff385c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Luxury Apartment in Downtown"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                  Description <span style={{ color: '#ff385c' }}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property in detail..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Location */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                  <FaMapMarkerAlt size={14} color="#ff385c" /> Location <span style={{ color: '#ff385c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Property Details */}
            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaHome size={18} color="#ff385c" /> Property Details
              </h2>

              {/* Type and Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="VILLA">Villa</option>
                    <option value="CABIN">Cabin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                    <FaDollarSign size={14} color="#ff385c" /> Price per Night <span style={{ color: '#ff385c' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Guests, Bedrooms, Bathrooms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                    <FaUsers size={14} color="#ff385c" /> Max Guests <span style={{ color: '#ff385c' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                    <FaBed size={14} color="#ff385c" /> Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="2"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                    <FaShower size={14} color="#ff385c" /> Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="1"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g., WiFi, Kitchen, Pool, AC, Parking"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: '#ff385c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FaCheck size={14} /> {loading ? 'Publishing...' : 'Publish Listing'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaTimes size={14} /> Cancel
              </button>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div>
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '24px',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>
                Listing Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Title Preview */}
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500' }}>
                    Title
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {formData.title || 'Not provided'}
                  </p>
                </div>

                {/* Location Preview */}
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500' }}>
                    Location
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {formData.location || 'Not provided'}
                  </p>
                </div>

                {/* Price Preview */}
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500' }}>
                    Price per Night
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#ff385c' }}>
                    ${formData.pricePerNight || '0'}
                  </p>
                </div>

                {/* Capacity Preview */}
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500' }}>
                    Capacity
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {formData.guests ? `${formData.guests} guests` : 'Not provided'}
                  </p>
                </div>

                {/* Type Preview */}
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500' }}>
                    Type
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {formData.type}
                  </p>
                </div>

                {/* Amenities Preview */}
                {formData.amenities && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '500' }}>
                      Amenities
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {formData.amenities.split(',').map((amenity, idx) => (
                        <p key={idx} style={{ fontSize: '13px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaCheck size={12} color="#ff385c" /> {amenity.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div style={{
                backgroundColor: '#fff5f7',
                border: '1px solid #ffcccc',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '20px',
                fontSize: '12px',
                color: '#666'
              }}>
                <p style={{ margin: 0, lineHeight: '1.5' }}>
                  ℹ️ Your listing will be visible to all users once published. You can edit it anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
