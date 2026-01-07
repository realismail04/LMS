const express = require('express');
const router = express.Router();
const { protect, instructor } = require('../middleware/authMiddleware');
const {
    enrollInCourse,
    getMyEnrollments,
    updateProgress,
    getInstructorStats,
    getInstructorEnrollments
} = require('../controllers/enrollmentController');

router.route('/')
    .post(protect, enrollInCourse);

router.route('/my')
    .get(protect, getMyEnrollments);

router.route('/instructor/stats')
    .get(protect, instructor, getInstructorStats);

router.route('/instructor/enrollments')
    .get(protect, instructor, getInstructorEnrollments);

router.route('/:courseId/progress')
    .put(protect, updateProgress);

module.exports = router;
