import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaWallet, FaArrowUp, FaArrowDown, FaHistory } from 'react-icons/fa'
import { apiService } from '../../../api'

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  useEffect(() => {
    loadWallet()
  }, [])

  const loadWallet = async () => {
    try {
      setLoading(true)
      const response = await apiService.getWallet()
      setWallet(response)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wallet'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(withdrawAmount)

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (amount > (wallet?.balance || 0)) {
      toast.error('Insufficient balance')
      return
    }

    try {
      setWithdrawing(true)
      await apiService.withdrawFromWallet(amount)
      toast.success('Withdrawal successful')
      setWithdrawAmount('')
      loadWallet()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to withdraw'
      toast.error(errorMessage)
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading wallet...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaWallet size={24} color="#ff385c" /> Wallet
      </h2>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          backgroundColor: 'linear-gradient(135deg, #ff385c 0%, #e63946 100%)',
          backgroundImage: 'linear-gradient(135deg, #ff385c 0%, #e63946 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(255, 56, 92, 0.3)'
        }}>
          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>
            Available Balance
          </p>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
            ${wallet?.balance?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>
            Total Earned
          </p>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#22c55e' }}>
            ${wallet?.totalEarned?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>
            Total Withdrawn
          </p>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#ef4444' }}>
            ${wallet?.totalWithdrawn?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Withdraw Funds</h3>
        <form onSubmit={handleWithdraw} style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Amount (USD)
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Available: ${wallet?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
          <button
            type="submit"
            disabled={withdrawing || !wallet?.balance}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff385c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: withdrawing || !wallet?.balance ? 'not-allowed' : 'pointer',
              opacity: withdrawing || !wallet?.balance ? 0.6 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowUp size={14} /> {withdrawing ? 'Processing...' : 'Withdraw'}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaHistory size={16} color="#ff385c" /> Transaction History
        </h3>

        {wallet?.transactions && wallet.transactions.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {wallet.transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: transaction.type === 'DEPOSIT' ? '#d4edda' : '#f8d7da',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: transaction.type === 'DEPOSIT' ? '#155724' : '#721c24'
                  }}>
                    {transaction.type === 'DEPOSIT' ? <FaArrowDown size={16} /> : <FaArrowUp size={16} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', margin: '2px 0 0 0' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: 0,
                  color: transaction.type === 'DEPOSIT' ? '#22c55e' : '#ef4444'
                }}>
                  {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            No transactions yet
          </p>
        )}
      </div>
    </div>
  )
}
