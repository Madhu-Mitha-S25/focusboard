const db = require('../config/db');

// Get events by date
const getEvents = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY event_date ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, event_time } = req.body;
    const result = await db.query(
      `INSERT INTO events (user_id, title, description, event_date, event_time)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, description, event_date, event_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getEvents, createEvent, deleteEvent };