const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getUsers,
    deleteUser,
    getStats,
    getInstructors
} = require('../controllers/userController');

// Public route for teachers page
router.get('/instructors', getInstructors);



router.route('/')
    .get(protect, admin, getUsers);

router.route('/stats')
    .get(protect, admin, getStats);

router.route('/:id')
    .delete(protect, admin, deleteUser);

module.exports = router;
