const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { planMyDay } = require('../controllers/ai.controller');

router.post('/plan', protect, planMyDay);

module.exports = router;