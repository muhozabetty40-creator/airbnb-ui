import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaPhone, FaFileUpload, FaCheck } from 'react-icons/fa'
import { useAuth } from '../features/auth/hooks/useAuth'
import { apiService } from '../api'

export default function ProfilePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  })
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const loadProfile = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProfile()
        setFormData({
          name: response.user.name || '',
          username: response.user.username || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          bio: response.user.bio || '',
          avatar: response.user.avatar || ''
        })
        if (response.user.avatar) {
          setPreviewUrl(response.user.avatar)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load profile'
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      const response = await apiService.uploadAvatar(file)
      
      setFormData(prev => ({
        ...prev,
        avatar: response.url
      }))
      setPreviewUrl(response.url)
      toast.success('Avatar uploaded successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar'
      toast.error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await apiService.updateProfile({
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        bio: formData.bio,
        avatar: formData.avatar
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <FaUser size={28} color="#ff385c" />
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>My Profile</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Avatar Upload */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: '500' }}>
            <FaFileUpload size={16} color="#ff385c" />
            Profile Picture
          </label>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start'
          }}>
            {previewUrl && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #ff385c'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Current</p>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666' }}>
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
              {uploading && (
                <p style={{ fontSize: '12px', color: '#ff385c', marginTop: '8px' }}>
                  Uploading...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
            <FaUser size={14} color="#ff385c" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Username */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
            <FaUser size={14} color="#ff385c" />
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
            <FaEnvelope size={14} color="#ff385c" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#f5f5f5',
              boxSizing: 'border-box',
              cursor: 'not-allowed'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
            <FaPhone size={14} color="#ff385c" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Bio */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving || uploading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff385c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
            opacity: (saving || uploading) ? 0.7 : 1,
            transition: 'opacity 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaCheck size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
