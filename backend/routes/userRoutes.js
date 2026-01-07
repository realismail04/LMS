const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getUsers,
    deleteUser,
    getStats,
    getAllUsersAcrossTenants
} = require('../controllers/userController');

router.get('/admin/all', protect, admin, getAllUsersAcrossTenants);

router.route('/')
    .get(protect, admin, getUsers);

router.route('/stats')
    .get(protect, admin, getStats);

router.route('/:id')
    .delete(protect, admin, deleteUser);

module.exports = router;
