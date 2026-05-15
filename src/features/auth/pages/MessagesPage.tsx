import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaPaperPlane, FaUser } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMessages()
      setMessages(response.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      await apiService.sendMessage({
        recipientId: selectedConversation,
        content: newMessage
      })
      toast.success('Message sent')
      setNewMessage('')
      loadMessages()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      toast.error(errorMessage)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading messages...</div>
  }

  const conversations = messages.reduce((acc: any, msg: any) => {
    const key = msg.senderId === msg.recipientId ? msg.senderId : [msg.senderId, msg.recipientId].sort().join('-')
    if (!acc[key]) {
      acc[key] = {
        id: key,
        otherUser: msg.senderId === msg.recipientId ? msg.sender : msg.sender?.id === msg.senderId ? msg.recipient : msg.sender,
        messages: []
      }
    }
    acc[key].messages.push(msg)
    return acc
  }, {})

  const conversationList = Object.values(conversations) as any[]

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Messages</h2>

      {conversationList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>No messages yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: '600px' }}>
          {/* Conversations List */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>Conversations</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversationList.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: selectedConversation === conv.id ? '#fff5f7' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConversation !== conv.id) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConversation !== conv.id) {
                      e.currentTarget.style.backgroundColor = 'white'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#ff385c',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {conv.otherUser?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.otherUser?.name || 'User'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#999', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.messages[conv.messages.length - 1]?.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {conversationList.find(c => c.id === selectedConversation)?.messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isOwn ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: msg.isOwn ? '#ff385c' : '#f0f0f0',
                      color: msg.isOwn ? 'white' : '#333',
                      fontSize: '14px',
                      wordBreak: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#ff385c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600'
                  }}
                >
                  <FaPaperPlane size={14} /> Send
                </button>
              </form>
            </div>
          ) : (
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#999' }}>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
