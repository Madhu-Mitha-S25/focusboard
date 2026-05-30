import Navbar from '../components/Navbar'
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
const [planLoading, setPlanLoading] = useState(false)
  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', { headers })
      setTasks(res.data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }

  const addTask = async () => {
    if (!title) return
    try {
      await axios.post('http://localhost:5000/api/tasks',
        { title, priority, status: 'backlog' },
        { headers }
      )
      setTitle('')
      fetchTasks()
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers })
      fetchTasks()
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const updateStatus = async (task, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date,
          status: newStatus
        },
        { headers }
      )
      fetchTasks()
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }
const planMyDay = async () => {
  try {
    setPlanLoading(true)
    await axios.post('http://localhost:5000/api/ai/plan', {}, { headers })
    alert('✅ AI has organized your tasks!')
    fetchTasks()
  } catch (err) {
    alert('AI planning failed. Try again!')
  } finally {
    setPlanLoading(false)
  }
}

  const filterTasks = (status) => tasks.filter(t => t.status === status)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

     <Navbar />

      {/* Add Task */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <input
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', minWidth: '200px' }}
          placeholder='Add a new task...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>
        <button
          onClick={addTask}
          style={{ padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
        >Add Task</button>
      </div>

<button
  onClick={planMyDay}
  style={{
    padding: '12px 24px',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
  {planLoading ? '⏳ Planning...' : '🤖 Plan My Day'}
</button>
      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

        {/* Today Column */}
        {['today', 'thisweek', 'backlog'].map((status) => (
          <div key={status} style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', minHeight: '400px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '16px',
              borderLeft: `4px solid ${status === 'today' ? '#4f46e5' : status === 'thisweek' ? '#0891b2' : '#6b7280'}`,
              paddingLeft: '8px'
            }}>
              <h2 style={{
                fontSize: '18px', fontWeight: 'bold',
                color: status === 'today' ? '#4f46e5' : status === 'thisweek' ? '#0891b2' : '#6b7280'
              }}>
                {status === 'today' ? 'Today' : status === 'thisweek' ? 'This Week' : 'Backlog'}
              </h2>
              <span style={{ backgroundColor: '#e2e8f0', borderRadius: '20px', padding: '2px 10px', fontSize: '14px' }}>
                {filterTasks(status).length}
              </span>
            </div>

            {filterTasks(status).length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>No tasks here</p>
            )}

            {filterTasks(status).map(task => (
              <div key={task.id} style={{ background: 'white', padding: '14px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
                <p style={{ fontSize: '15px', marginBottom: '8px', fontWeight: '500' }}>{task.title}</p>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  backgroundColor: task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef9c3' : '#dcfce7',
                  color: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#ca8a04' : '#16a34a'
                }}>
                  {task.priority}
                </span>

                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {status !== 'today' && (
                    <button onClick={() => updateStatus(task, 'today')}
                      style={{ padding: '4px 10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      Today
                    </button>
                  )}
                  {status !== 'thisweek' && (
                    <button onClick={() => updateStatus(task, 'thisweek')}
                      style={{ padding: '4px 10px', backgroundColor: '#0891b2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      This Week
                    </button>
                  )}
                  {status !== 'backlog' && (
                    <button onClick={() => updateStatus(task, 'backlog')}
                      style={{ padding: '4px 10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      Backlog
                    </button>
                  )}
                  <button onClick={() => deleteTask(task.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Dashboard