import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button, Field, Input } from '../components/UI'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="form card">
      <h2 className="page-title">Create Account</h2>
      {error && <div className="badge warning">{error}</div>}
      <Field label="Name">
        <Input value={name} onChange={(e)=>setName(e.target.value)} />
      </Field>
      <Field label="Email">
        <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </Field>
      <div className="actions">
        <Button variant="primary" type="submit">Sign up</Button>
        <Button type="button" className="ghost" onClick={()=>{setName('');setEmail('');setPassword('')}}>Clear</Button>
      </div>
    </form>
  )
}
