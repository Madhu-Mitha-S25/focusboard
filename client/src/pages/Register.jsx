import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Try again.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>FocusBoard 🎯</h1>
        <p style={styles.subtitle}>Create your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          type='text'
          placeholder='Full Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleRegister}>Register</button>
        <p style={styles.link}>
          Already have an account? <Link to='/'>Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5'
  },
  box: {
    background: 'white', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%',
    maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px'
  },
  title: { textAlign: 'center', color: '#4f46e5' },
  subtitle: { textAlign: 'center', color: '#666' },
  input: {
    padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '16px'
  },
  button: {
    padding: '12px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px'
  },
  error: { color: 'red', textAlign: 'center' },
  link: { textAlign: 'center', color: '#666' }
}

export default Register