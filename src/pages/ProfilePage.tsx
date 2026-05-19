import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import { useAuth } from '../features/auth/hooks/useAuth'
import { apiService } from '../api'
import '../features/auth/pages/DashboardPage.css'

interface ProfileData {
  name: string
  username: string
  email: string
  phone: string
  bio: string
  avatar: string
  role: string
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({ name: '', username: '', email: '', phone: '', bio: '', avatar: '', role: '' })
  const [form, setForm] = useState<ProfileData>({ name: '', username: '', email: '', phone: '', bio: '', avatar: '', role: '' })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    apiService.getProfile()
      .then(res => {
        const data = { name: res.user.name || '', username: res.user.username || '', email: res.user.email || '', phone: res.user.phone || '', bio: res.user.bio || '', avatar: res.user.avatar || '', role: res.user.role || '' }
        setProfile(data)
        setForm(data)
      })
      .catch(err => toast.error(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await apiService.updateProfile({ name: form.name, username: form.username, phone: form.phone, bio: form.bio, avatar: form.avatar })
      setProfile(form)
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max file size is 5MB'); return }
    try {
      const res = await apiService.uploadAvatar(file)
      setForm(f => ({ ...f, avatar: res.url }))
      toast.success('Avatar uploaded!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const roleLabel = profile.role === 'HOST' ? '🏠 Host' : profile.role === 'ADMIN' ? '🛡️ Admin' : '👤 Guest'
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : profile.email?.[0]?.toUpperCase() || 'U'

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>

  return (
    <div style={{ maxWidth: '760px', margin: '40px auto', padding: '0 20px 60px' }}>

      {/* Header card */}
      <div className="db-banner" style={{ marginBottom: '24px' }}>
        <div className="db-banner__content">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
            {profile.avatar ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div>
            <p className="db-banner__title">{profile.name || profile.username || 'My Profile'}</p>
            <p className="db-banner__desc">{roleLabel} · {profile.email}</p>
            {!editing && (
              <button className="db-banner__btn" onClick={() => setEditing(true)}>
                <FaEdit size={12} style={{ marginRight: 6 }} />Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className="db-banner__illustration">👤</div>
      </div>

      {!editing ? (
        /* ── View Mode ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: <FaUser size={14} color="#ff5724" />, label: 'Full Name', value: profile.name || '—' },
            { icon: <FaUser size={14} color="#ff5724" />, label: 'Username', value: profile.username ? `@${profile.username}` : '—' },
            { icon: <FaEnvelope size={14} color="#ff5724" />, label: 'Email', value: profile.email },
            { icon: <FaPhone size={14} color="#ff5724" />, label: 'Phone', value: profile.phone || '—' },
          ].map(row => (
            <div key={row.label} className="db-stat-card" style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {row.icon}
                <div>
                  <p className="db-stat-card__label" style={{ marginBottom: 2 }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' }}>{row.value}</p>
                </div>
              </div>
            </div>
          ))}
          {profile.bio && (
            <div className="db-metric" style={{ padding: '20px 24px' }}>
              <span className="db-metric__label">Bio</span>
              <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{profile.bio}</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Edit Mode ── */
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Avatar */}
          <div className="db-metric">
            <span className="db-metric__label">Profile Picture</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ff5724', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', overflow: 'hidden', flexShrink: 0 }}>
                {form.avatar ? <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ fontSize: 13 }} />
            </div>
          </div>

          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
            { label: 'Username', name: 'username', type: 'text', placeholder: 'Your username' },
            { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+1 234 567 8900' },
          ].map(field => (
            <div key={field.name} className="db-metric" style={{ gap: 8 }}>
              <span className="db-metric__label">{field.label}</span>
              <input
                type={field.type}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                style={{ padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', width: '100%' }}
              />
            </div>
          ))}

          {/* Email read-only */}
          <div className="db-metric" style={{ gap: 8 }}>
            <span className="db-metric__label">Email <span style={{ color: '#9ca3af', fontWeight: 400 }}>(cannot be changed)</span></span>
            <input value={profile.email} disabled style={{ padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', color: '#9ca3af', width: '100%' }} />
          </div>

          {/* Bio */}
          <div className="db-metric" style={{ gap: 8 }}>
            <span className="db-metric__label">Bio</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Tell us about yourself..."
              style={{ padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} className="db-banner__btn" style={{ background: '#ff5724', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaCheck size={13} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => { setForm(profile); setEditing(false) }} className="db-btn db-btn--outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaTimes size={13} /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
