const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const Submission = require('../models/Submission');
const crypto = require('crypto');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!req.tenant) {
            return res.status(400).json({ message: 'Tenant context required' });
        }

        const course = await Course.findOne({ _id: courseId, tenant: req.tenant._id }).populate('prerequisites');
        if (!course) {
            res.status(404).json({ message: 'Course not found in this organization' });
            return;
        }

        // Check prerequisites
        if (course.prerequisites && course.prerequisites.length > 0) {
            const completedEnrollments = await Enrollment.find({
                user: req.user.id,
                course: { $in: course.prerequisites.map(p => p._id) },
                completed: true
            });

            if (completedEnrollments.length < course.prerequisites.length) {
                return res.status(400).json({
                    message: 'You must complete the prerequisites before enrolling in this course.',
                    prerequisites: course.prerequisites.map(p => p.title)
                });
            }
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user.id,
            course: courseId
        });

        if (existingEnrollment) {
            res.status(400).json({ message: 'Already enrolled in this course' });
            return;
        }

        // Commercial Check: Only free courses can be enrolled directly
        if (course.price > 0) {
            return res.status(402).json({
                message: 'This is a paid course. Please submit payment verification.',
                requiresPayment: true
            });
        }

        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: courseId,
            completedLessons: [],
            progress: 0
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user enrollments
// @route   GET /api/enrollments/my
// @access  Private
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id })
            .populate('course') // Populate course details
            .populate('completedLessons'); // Populate lesson details if they were separate models, but here they are IDs from Course embedded

        // Note: Since lessons are embedded in Course, we don't strictly populate 'completedLessons' as a model unless we changed schema.
        // The Schema says completedLessons: [{ type: ObjectId, ref: 'Lesson' }]
        // But our Course model has embedded lessons. 
        // We will assume the ID stored matches the embedded subdocument ID.

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update progress (mark lesson complete)
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private
const updateProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { lessonId } = req.body;

        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: courseId
        });

        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }

        // Add lesson to completed if not already there
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);

            // Calculate Progress
            const course = await Course.findById(courseId);
            if (course && course.lessons.length > 0) {
                enrollment.progress = (enrollment.completedLessons.length / course.lessons.length) * 100;
            }

            // Check if course completed
            if (enrollment.progress === 100) {
                enrollment.completed = true;

                // Generate Certificate
                const existingCert = await Certificate.findOne({ user: req.user.id, course: courseId });
                if (!existingCert) {
                    const certificateId = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
                    await Certificate.create({
                        user: req.user.id,
                        course: courseId,
                        certificateId,
                        tenant: req.tenant._id
                    });
                }
            }

            await enrollment.save();
        }

        res.json(enrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get instructor statistics
// @route   GET /api/enrollments/instructor/stats
// @access  Private/Instructor
const getInstructorStats = async (req, res) => {
    try {
        if (!req.tenant) {
            return res.status(400).json({ message: 'Tenant context required' });
        }
        // Find all courses by this instructor in this tenant
        const courses = await Course.find({ user: req.user.id, tenant: req.tenant._id });
        const courseIds = courses.map(c => c._id);

        // Find all enrollments in these courses
        const enrollments = await Enrollment.find({ course: { $in: courseIds } });

        const studentCount = new Set(enrollments.map(e => e.user.toString())).size;
        const revenue = courses.reduce((acc, course) => {
            const courseEnrollments = enrollments.filter(e => e.course.toString() === course._id.toString());
            return acc + (course.price * courseEnrollments.length);
        }, 0);

        res.json({
            totalStudents: studentCount,
            totalRevenue: revenue,
            activeCourses: courses.length,
            averageRating: 4.8 // Mocked for now
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get instructor recent enrollments
// @route   GET /api/enrollments/instructor/enrollments
// @access  Private/Instructor
const getInstructorEnrollments = async (req, res) => {
    try {
        if (!req.tenant) {
            return res.status(400).json({ message: 'Tenant context required' });
        }
        const courses = await Course.find({ user: req.user.id, tenant: req.tenant._id });
        const courseIds = courses.map(c => c._id);

        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('user', 'name email')
            .populate('course', 'title price')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my certificates
// @route   GET /api/enrollments/my/certificates
const getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id })
            .populate('course', 'title image')
            .populate('user', 'name email');
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get course certificate
// @route   GET /api/enrollments/:courseId/certificate
const getCourseCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            user: req.user.id,
            course: req.params.courseId
        }).populate('course', 'title image').populate('user', 'name email');

        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my submissions
// @route   GET /api/enrollments/my/submissions
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.id })
            .populate('course', 'title')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    enrollInCourse,
    getMyEnrollments,
    updateProgress,
    getInstructorStats,
    getInstructorEnrollments,
    getMyCertificates,
    getCourseCertificate,
    getMySubmissions
};
