const express = require('express');
const router = express.Router();
const { protect, instructor } = require('../middleware/authMiddleware');
const {
    enrollInCourse,
    getMyEnrollments,
    updateProgress,
    getInstructorStats,
    getInstructorEnrollments,
    getMyCertificates,
    getCourseCertificate,
    getMySubmissions
} = require('../controllers/enrollmentController');

router.route('/')
    .post(protect, enrollInCourse);

router.route('/my')
    .get(protect, getMyEnrollments);

router.route('/my/certificates')
    .get(protect, getMyCertificates);

router.route('/my/submissions')
    .get(protect, getMySubmissions);

router.route('/:courseId/certificate')
    .get(protect, getCourseCertificate);

router.route('/instructor/stats')
    .get(protect, instructor, getInstructorStats);

router.route('/instructor/enrollments')
    .get(protect, instructor, getInstructorEnrollments);

router.route('/:courseId/progress')
    .put(protect, updateProgress);

module.exports = router;
