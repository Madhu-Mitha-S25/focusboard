import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  const navItems = [
    { label: '🎯 Dashboard', path: '/dashboard' },
    { label: '📅 Calendar', path: '/calendar' },
    { label: '📝 Notes', path: '/notes' },
  ]

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>FocusBoard</h2>
      <div style={styles.links}>
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navBtn,
              backgroundColor: location.pathname === item.path ? '#4f46e5' : 'transparent',
              color: location.pathname === item.path ? 'white' : '#4f46e5',
            }}
          >{item.label}</button>
        ))}
      </div>
      <button onClick={logout} style={styles.logoutBtn}>Logout</button>
    </div>
  )
}

const styles = {
  navbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 24px', backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px'
  },
  logo: { color: '#4f46e5', fontSize: '22px' },
  links: { display: 'flex', gap: '8px' },
  navBtn: {
    padding: '8px 16px', border: '1px solid #4f46e5',
    borderRadius: '8px', fontSize: '14px', cursor: 'pointer'
  },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
  }
}

export default Navbar