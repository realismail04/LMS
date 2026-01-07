const Engagement = require('../models/Engagement');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

/**
 * Gets overview stats for an instructor's courses
 */
const getInstructorStats = async (req, res) => {
    try {
        const tenantId = req.tenant._id;
        const instructorId = req.user._id;

        // 1. Get all courses by this instructor
        const courses = await Course.find({
            instructor: instructorId,
            tenant: tenantId
        }).select('_id title');
        const courseIds = courses.map(c => c._id);

        // 2. Aggregate total enrollments
        const totalEnrollments = await Enrollment.countDocuments({
            course: { $in: courseIds },
            tenant: tenantId
        });

        // 3. Aggregate quiz performance
        const quizStats = await Submission.aggregate([
            { $match: { course: { $in: courseIds }, tenant: tenantId, type: 'quiz' } },
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$score' },
                    totalAttempts: { $sum: 1 },
                    passedCount: { $sum: { $cond: [{ $eq: ['$status', 'passed'] }, 1, 0] } }
                }
            }
        ]);

        // 4. Daily engagement trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const engagementTrends = await Engagement.aggregate([
            {
                $match: {
                    course: { $in: courseIds },
                    tenant: tenantId,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    views: { $sum: { $cond: [{ $eq: ["$type", "view"] }, 1, 0] } },
                    completions: { $sum: { $cond: [{ $eq: ["$type", "completion"] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            summary: {
                totalCourses: courses.length,
                totalStudents: totalEnrollments,
                avgQuizScore: quizStats[0]?.avgScore || 0,
                quizPassRate: quizStats[0] ? (quizStats[0].passedCount / quizStats[0].totalAttempts) * 100 : 0
            },
            trends: engagementTrends
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};

/**
 * Log an engagement event
 */
const logEvent = async (req, res) => {
    const { courseId, lessonId, type, duration, metadata } = req.body;
    try {
        const engagement = await Engagement.create({
            user: req.user._id,
            course: courseId,
            lesson: lessonId,
            tenant: req.tenant._id,
            type,
            duration,
            metadata
        });
        res.status(201).json(engagement);
    } catch (error) {
        res.status(500).json({ message: 'Error logging engagement' });
    }
};

module.exports = {
    getInstructorStats,
    logEvent
};
