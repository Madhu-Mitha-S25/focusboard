import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Calendar() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events', { headers })
      setEvents(res.data)
    } catch (err) {
      console.error('Error fetching events:', err)
    }
  }

  const addEvent = async () => {
    if (!title || !selectedDate) return
    try {
      await axios.post('http://localhost:5000/api/events',
        { title, description, event_date: selectedDate, event_time: time },
        { headers }
      )
      setTitle('')
      setTime('')
      setDescription('')
      fetchEvents()
    } catch (err) {
      console.error('Error adding event:', err)
    }
  }

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, { headers })
      fetchEvents()
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  const selectedEvents = events.filter(e => e.event_date?.split('T')[0] === selectedDate)
  const eventDates = events.map(e => e.event_date?.split('T')[0])

  // Build calendar days for current month
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = today.toLocaleString('default', { month: 'long' })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ color: '#4f46e5', marginBottom: '24px' }}>📅 Calendar</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* Left — Calendar Grid */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '16px', color: '#4f46e5' }}>
              {monthName} {year}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={{ fontWeight: 'bold', color: '#6b7280', padding: '8px', fontSize: '13px' }}>{d}</div>
              ))}
              {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isSelected = dateStr === selectedDate
                const hasEvent = eventDates.includes(dateStr)
                const isToday = dateStr === new Date().toISOString().split('T')[0]
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      padding: '8px', borderRadius: '8px', cursor: 'pointer',
                      backgroundColor: isSelected ? '#4f46e5' : isToday ? '#e0e7ff' : 'transparent',
                      color: isSelected ? 'white' : '#333',
                      fontWeight: isToday ? 'bold' : 'normal',
                      position: 'relative'
                    }}
                  >
                    {day}
                    {hasEvent && (
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: isSelected ? 'white' : '#4f46e5',
                        margin: '2px auto 0'
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — Events for Selected Date */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4f46e5' }}>
                Add Event for {selectedDate}
              </h3>
              <input
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '15px', boxSizing: 'border-box' }}
                placeholder='Event title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type='time'
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '15px', boxSizing: 'border-box' }}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <textarea
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '15px', boxSizing: 'border-box', height: '80px' }}
                placeholder='Description (optional)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                onClick={addEvent}
                style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}
              >Add Event</button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '16px', color: '#4f46e5' }}>
                Events on {selectedDate}
              </h3>
              {selectedEvents.length === 0 && (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>No events for this day</p>
              )}
              {selectedEvents.map(event => (
                <div key={event.id} style={{ padding: '12px', backgroundColor: '#f0f4ff', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#4f46e5' }}>{event.title}</p>
                    {event.event_time && <p style={{ fontSize: '13px', color: '#6b7280' }}>⏰ {event.event_time}</p>}
                    {event.description && <p style={{ fontSize: '13px', color: '#6b7280' }}>{event.description}</p>}
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    style={{ padding: '6px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >🗑️</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar