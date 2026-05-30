const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { getEvents, createEvent, deleteEvent } = require('../controllers/event.controller');

router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;