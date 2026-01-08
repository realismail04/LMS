const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a course review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        // Check if student is enrolled
        const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
        if (!enrollment) {
            return res.status(403).json({ message: 'You must be enrolled to review this course' });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ user: req.user.id, course: courseId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this course' });
        }

        const review = await Review.create({
            user: req.user.id,
            course: courseId,
            rating,
            comment,
            tenant: req.tenant._id
        });

        // Update Course Rating (Simple Average)
        const reviews = await Review.find({ course: courseId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await Course.findByIdAndUpdate(courseId, {
            rating: avgRating,
            numReviews: reviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ course: req.params.courseId })
            .populate('user', 'name image')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getCourseReviews
};
