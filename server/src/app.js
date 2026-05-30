const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const eventRoutes = require('./routes/event.routes');
const noteRoutes = require('./routes/note.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FocusBoard API is running!' });
});

module.exports = app;