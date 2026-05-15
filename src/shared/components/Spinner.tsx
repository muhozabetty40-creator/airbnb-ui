export default function Spinner() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0'
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #ff5724',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
