import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaCamera, FaHome, FaMapMarkerAlt, FaDollarSign, FaUsers, FaBed, FaShower, FaCheck, FaTimes } from 'react-icons/fa'
import { apiService } from '../../../api'

const INPUT: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
}

const LABEL: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6
}

export default function AddListingDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', location: '', pricePerNight: '',
    guests: '', bedrooms: '', bathrooms: '', type: 'APARTMENT', amenities: '', image: null as File | null
  })

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return }
    setForm(f => ({ ...f, image: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.location || !form.pricePerNight || !form.guests) {
      toast.error('Please fill all required fields'); return
    }
    if (!form.image) { toast.error('Please upload an image'); return }
    try {
      setLoading(true)
      const { url } = await apiService.uploadAvatar(form.image)
      await apiService.createListing({
        title: form.title, description: form.description, location: form.location,
        pricePerNight: Number(form.pricePerNight), guests: Number(form.guests),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        type: form.type,
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()) : [],
        image: url
      })
      toast.success('Listing published!')
      navigate('/dashboard/listings')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Banner */}
      <div className="db-banner">
        <div className="db-banner__content">
          <div>
            <p className="db-banner__title">Add New Listing</p>
            <p className="db-banner__desc">Share your property with thousands of potential guests around the world.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Image upload */}
          <div className="db-metric" style={{ gap: 12 }}>
            <div className="db-metric__header">
              <span className="db-metric__label"><FaCamera size={13} style={{ marginRight: 6 }} />Property Image <span style={{ color: '#ff5724' }}>*</span></span>
            </div>
            <label style={{
              display: 'block', border: `2px dashed ${preview ? '#ff5724' : '#e5e7eb'}`,
              borderRadius: 12, padding: preview ? 0 : '40px 20px', textAlign: 'center',
              cursor: 'pointer', overflow: 'hidden', background: preview ? 'transparent' : '#f9fafb'
            }}>
              {preview
                ? <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                : <>
                    <FaCamera size={32} color="#d1d5db" />
                    <p style={{ margin: '10px 0 4px', fontSize: 14, fontWeight: 500, color: '#374151' }}>Click to upload</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>JPG, PNG — max 5MB</p>
                  </>
              }
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
            </label>
            {preview && <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Click image to change</p>}
          </div>

          {/* Basic info */}
          <div className="db-metric" style={{ gap: 14 }}>
            <span className="db-metric__label">Basic Information</span>

            <div>
              <label style={LABEL}><FaHome size={12} color="#ff5724" />Title <span style={{ color: '#ff5724' }}>*</span></label>
              <input name="title" value={form.title} onChange={set} placeholder="e.g. Luxury Apartment in Downtown" style={INPUT} />
            </div>

            <div>
              <label style={LABEL}>Description <span style={{ color: '#ff5724' }}>*</span></label>
              <textarea name="description" value={form.description} onChange={set} rows={4}
                placeholder="Describe your property..." style={{ ...INPUT, resize: 'vertical' }} />
            </div>

            <div>
              <label style={LABEL}><FaMapMarkerAlt size={12} color="#ff5724" />Location <span style={{ color: '#ff5724' }}>*</span></label>
              <input name="location" value={form.location} onChange={set} placeholder="e.g. New York, NY" style={INPUT} />
            </div>
          </div>

          {/* Property details */}
          <div className="db-metric" style={{ gap: 14 }}>
            <span className="db-metric__label">Property Details</span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL}>Property Type</label>
                <select name="type" value={form.type} onChange={set} style={INPUT}>
                  {['APARTMENT', 'HOUSE', 'VILLA', 'CABIN'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={LABEL}><FaDollarSign size={12} color="#ff5724" />Price / Night <span style={{ color: '#ff5724' }}>*</span></label>
                <input name="pricePerNight" type="number" min="0" value={form.pricePerNight} onChange={set} placeholder="100" style={INPUT} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL}><FaUsers size={12} color="#ff5724" />Guests <span style={{ color: '#ff5724' }}>*</span></label>
                <input name="guests" type="number" min="1" value={form.guests} onChange={set} placeholder="4" style={INPUT} />
              </div>
              <div>
                <label style={LABEL}><FaBed size={12} color="#ff5724" />Bedrooms</label>
                <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={set} placeholder="2" style={INPUT} />
              </div>
              <div>
                <label style={LABEL}><FaShower size={12} color="#ff5724" />Bathrooms</label>
                <input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={set} placeholder="1" style={INPUT} />
              </div>
            </div>

            <div>
              <label style={LABEL}>Amenities <span style={{ color: '#9ca3af', fontWeight: 400 }}>(comma-separated)</span></label>
              <input name="amenities" value={form.amenities} onChange={set} placeholder="WiFi, Kitchen, Pool, AC" style={INPUT} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '12px', background: '#ff5724', color: '#fff', border: 'none',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <FaCheck size={13} />{loading ? 'Publishing...' : 'Publish Listing'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="db-btn db-btn--outline" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaTimes size={13} />Cancel
            </button>
          </div>
        </div>

        {/* ── Right column — live summary ── */}
        <div className="db-metric" style={{ gap: 16, position: 'sticky', top: 80 }}>
          <span className="db-metric__label">Listing Preview</span>

          {form.title || form.location || form.pricePerNight ? (
            <>
              {preview && <img src={preview} alt="preview" style={{ width: '100%', borderRadius: 10, objectFit: 'cover', maxHeight: 140 }} />}
              {[
                { label: 'Title', value: form.title },
                { label: 'Location', value: form.location },
                { label: 'Type', value: form.type },
                { label: 'Price / Night', value: form.pricePerNight ? `$${form.pricePerNight}` : '' },
                { label: 'Guests', value: form.guests ? `${form.guests} guests` : '' },
              ].filter(r => r.value).map(row => (
                <div key={row.label}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{row.value}</p>
                </div>
              ))}
              {form.amenities && (
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Amenities</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {form.amenities.split(',').filter(Boolean).map((a, i) => (
                      <span key={i} style={{ background: '#fff1ee', color: '#ff5724', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>{a.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Fill in the form to see a live preview here.</p>
          )}
        </div>
      </form>
    </>
  )
}
