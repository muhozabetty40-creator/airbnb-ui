import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

interface Props {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(email, password)
    onSuccess()
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-form__title">Sign in</h2>
      <div className="login-form__field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="login-form__field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <button type="submit" className="login-form__btn">Sign in</button>
    </form>
  )
}
