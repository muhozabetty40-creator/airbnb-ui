import { useState, useEffect } from 'react'
import { FaTimes, FaCheck, FaTrash } from 'react-icons/fa'
import { apiService } from '../../api'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadNotifications()
    }
  }, [open])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await apiService.getNotifications()
      setNotifications(response.data || [])
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '400px', height: '100vh',
        backgroundColor: 'white', boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '16px', borderBottom: '1px solid #e0e0e0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Notifications</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '20px', color: '#666'
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No notifications yet
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                style={{
                  padding: '12px 16px', borderBottom: '1px solid #f0f0f0',
                  backgroundColor: notif.isRead ? 'transparent' : '#f9f9f9',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                      {notif.title}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                      {notif.message}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#ff5724', fontSize: '14px', padding: '4px'
                        }}
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#999', fontSize: '14px', padding: '4px'
                      }}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
