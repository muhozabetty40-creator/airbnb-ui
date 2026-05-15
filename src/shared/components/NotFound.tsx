import { Link } from 'react-router-dom'
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
  return (
    <main className="not-found" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', color: '#ff385c' }}>
          <FaExclamationTriangle size={80} />
        </div>
        <h1 className="not-found__code" style={{ fontSize: '72px', fontWeight: '700', margin: '0 0 16px 0', color: '#1a1a1a' }}>404</h1>
        <p className="not-found__msg" style={{ fontSize: '24px', color: '#666', marginBottom: '32px' }}>Page not found</p>
        <Link to="/" className="not-found__link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ff385c', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e63946'; e.currentTarget.style.transform = 'scale(1.05)' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ff385c'; e.currentTarget.style.transform = 'scale(1)' }}>
          <FaArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </main>
  )
}
