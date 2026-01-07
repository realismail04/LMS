const express = require('express');
const router = express.Router();
const { getInstructorStats, logEvent } = require('../controllers/analyticsController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.get('/instructor', protect, instructor, getInstructorStats);
router.post('/log', protect, logEvent);

module.exports = router;
