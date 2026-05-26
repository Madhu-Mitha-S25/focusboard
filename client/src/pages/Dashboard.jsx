import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) navigate('/')
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks', { headers })
    setTasks(res.data)
  }

  const addTask = async () => {
    if (!title) return
    await axios.post('http://localhost:5000/api/tasks',
      { title, priority, status: 'backlog' },
      { headers }
    )
    setTitle('')
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers })
    fetchTasks()
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>FocusBoard 🎯</h1>
        <div style={styles.userInfo}>
          <span>Hello, {user?.name}!</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.addTask}>
        <input
          style={styles.input}
          placeholder='Add a new task...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          style={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>
        <button style={styles.addBtn} onClick={addTask}>Add Task</button>
      </div>

      <div style={styles.taskList}>
        {tasks.length === 0 && (
          <p style={styles.empty}>No tasks yet. Add one above!</p>
        )}
        {tasks.map(task => (
          <div key={task.id} style={styles.taskCard}>
            <div>
              <p style={styles.taskTitle}>{task.title}</p>
              <span style={{
                ...styles.badge,
                backgroundColor: task.priority === 'high' ? '#fee2e2' :
                  task.priority === 'medium' ? '#fef9c3' : '#dcfce7',
                color: task.priority === 'high' ? '#dc2626' :
                  task.priority === 'medium' ? '#ca8a04' : '#16a34a'
              }}>
                {task.priority}
              </span>
            </div>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteTask(task.id)}
            >Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '24px'
  },
  title: { color: '#4f46e5', fontSize: '28px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '8px'
  },
  addTask: { display: 'flex', gap: '12px', marginBottom: '24px' },
  input: {
    flex: 1, padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '16px'
  },
  select: {
    padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '16px'
  },
  addBtn: {
    padding: '12px 24px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px'
  },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: {
    background: 'white', padding: '16px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  taskTitle: { fontSize: '16px', marginBottom: '6px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  deleteBtn: {
    padding: '8px 16px', backgroundColor: '#fee2e2',
    color: '#dc2626', border: 'none', borderRadius: '8px'
  },
  empty: { textAlign: 'center', color: '#999', marginTop: '40px' }
}

export default Dashboard