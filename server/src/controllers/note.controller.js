const db = require('../config/db');

// Get all notes
const getNotes = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create note
const createNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const result = await db.query(
      `INSERT INTO notes (user_id, title, content, color)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, title, content, color || '#fef9c3']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color } = req.body;
    const result = await db.query(
      `UPDATE notes SET title = $1, content = $2, color = $3
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [title, content, color, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };