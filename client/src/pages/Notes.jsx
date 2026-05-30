import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#fef9c3')
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const colors = ['#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3', '#ede9fe']

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', { headers })
      setNotes(res.data)
    } catch (err) {
      console.error('Error fetching notes:', err)
    }
  }

  const saveNote = async () => {
    if (!title) return
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/notes/${editingId}`,
          { title, content, color }, { headers }
        )
        setEditingId(null)
      } else {
        await axios.post('http://localhost:5000/api/notes',
          { title, content, color }, { headers }
        )
      }
      setTitle('')
      setContent('')
      setColor('#fef9c3')
      fetchNotes()
    } catch (err) {
      console.error('Error saving note:', err)
    }
  }

  const editNote = (note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setColor(note.color)
  }

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, { headers })
      fetchNotes()
    } catch (err) {
      console.error('Error deleting note:', err)
    }
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ color: '#4f46e5', marginBottom: '24px' }}>📝 Notes</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>

          {/* Left — Add Note */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '16px', color: '#4f46e5' }}>
              {editingId ? 'Edit Note' : 'New Note'}
            </h3>
            <input
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '15px', boxSizing: 'border-box' }}
              placeholder='Note title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '15px', boxSizing: 'border-box', height: '150px' }}
              placeholder='Write your note here...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Color Picker */}
            <p style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>Pick a color:</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {colors.map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: c, cursor: 'pointer',
                    border: color === c ? '3px solid #4f46e5' : '2px solid #ddd'
                  }}
                />
              ))}
            </div>

            <button
              onClick={saveNote}
              style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}
            >{editingId ? 'Update Note' : 'Save Note'}</button>

            {editingId && (
              <button
                onClick={() => { setEditingId(null); setTitle(''); setContent(''); setColor('#fef9c3') }}
                style={{ width: '100%', padding: '12px', backgroundColor: '#f1f5f9', color: '#6b7280', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
              >Cancel</button>
            )}
          </div>

          {/* Right — Notes Grid */}
          <div>
            {notes.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>No notes yet. Create one!</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {notes.map(note => (
                <div
                  key={note.id}
                  style={{ backgroundColor: note.color, borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}
                >
                  <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>{note.title}</h3>
                  <p style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '12px' }}>
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                      onClick={() => editNote(note)}
                      style={{ flex: 1, padding: '6px', backgroundColor: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    >✏️ Edit</button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{ flex: 1, padding: '6px', backgroundColor: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    >🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notes