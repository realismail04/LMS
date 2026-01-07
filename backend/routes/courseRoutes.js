const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    submitQuiz,
    submitAssignment,
    gradeAssignment,
    getSubmissions,
    getMySubmissions,
    submitOfflinePayment,
    getPendingPayments,
    verifyPayment,
    getMyOrders
} = require('../controllers/courseController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, instructor, createCourse);

router.get('/instructor/submissions', protect, instructor, getSubmissions);
router.get('/instructor/payments', protect, instructor, getPendingPayments);
router.get('/my/submissions', protect, getMySubmissions);
router.get('/my/orders', protect, getMyOrders);

router.post('/payment', protect, submitOfflinePayment);
router.put('/payment/:id/verify', protect, instructor, verifyPayment);

router.route('/:id')
    .get(getCourse)
    .put(protect, instructor, updateCourse)
    .delete(protect, instructor, deleteCourse);

router.post('/:courseId/lessons/:lessonId/submit', protect, submitQuiz);
router.post('/:courseId/lessons/:lessonId/assignment', protect, submitAssignment);
router.put('/submissions/:id/grade', protect, instructor, gradeAssignment);

module.exports = router;
