const Course = require('../models/Course');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Enrollment = require('../models/Enrollment');
const Order = require('../models/Order');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

        const { keyword, category, level } = req.query;
        let query = { tenant: req.tenant._id };

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (level) {
            query.level = level;
        }

        const courses = await Course.find(query);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });
        const course = await Course.findOne({ _id: req.params.id, tenant: req.tenant._id });
        if (course) {
            // Drip Content calculation
            let lessonsWithStatus = [];
            const enrollment = await Enrollment.findOne({ user: req.user?.id, course: course._id });

            const processLesson = (lesson) => {
                let isLocked = false;
                if (lesson.isDrip && enrollment) {
                    const daysSinceEnrollment = Math.floor((new Date() - new Date(enrollment.createdAt)) / (1000 * 60 * 60 * 24));
                    if (daysSinceEnrollment < (lesson.unlockDays || 0)) {
                        isLocked = true;
                    }
                }
                return { ...lesson.toObject(), isLocked };
            };

            const updatedModules = course.modules.map(module => ({
                ...module.toObject(),
                lessons: module.lessons.map(processLesson)
            }));

            const updatedLessons = course.lessons.map(processLesson);

            const result = course.toObject();
            result.modules = updatedModules;
            result.lessons = updatedLessons;

            res.json(result);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
    try {
        const { title, description, category, price, image, level, modules, lessons } = req.body;
        if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

        const course = new Course({
            user: req.user.id,
            tenant: req.tenant._id,
            title,
            description,
            category,
            price,
            image: image || 'https://via.placeholder.com/300',
            level: level || 'beginner',
            modules: modules || [],
            lessons: lessons || []
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
    try {
        if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });
        const course = await Course.findOne({ _id: req.params.id, tenant: req.tenant._id });

        if (course) {
            if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'User not authorized' });
            }

            const { title, description, category, price, image, status, level, modules, lessons } = req.body;
            course.title = title || course.title;
            course.description = description || course.description;
            course.category = category || course.category;
            course.price = price || course.price;
            course.image = image || course.image;
            course.status = status || course.status;
            course.level = level || course.level;
            if (modules) course.modules = modules;
            if (lessons) course.lessons = lessons;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = async (req, res) => {
    try {
        if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });
        const course = await Course.findOne({ _id: req.params.id, tenant: req.tenant._id });

        if (course) {
            if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'User not authorized' });
            }
            await Course.deleteOne({ _id: req.params.id });
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Assignment & Quiz Logic ---

const submitQuiz = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const { answers } = req.body;

    try {
        const course = await Course.findOne({ _id: courseId, tenant: req.tenant._id });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        let lesson = null;
        for (const module of course.modules) {
            const found = module.lessons.find(l => l._id.toString() === lessonId);
            if (found) { lesson = found; break; }
        }
        if (!lesson && course.lessons) {
            lesson = course.lessons.find(l => l._id.toString() === lessonId);
        }

        if (!lesson || lesson.type !== 'quiz') return res.status(404).json({ message: 'Quiz lesson not found' });

        let correctCount = 0;
        const gradedAnswers = lesson.quizData.questions.map(q => {
            const userAnswer = answers.find(a => a.questionId === q._id.toString());
            const isCorrect = userAnswer?.answer === q.correctAnswer;
            if (isCorrect) correctCount++;
            return { questionId: q._id, answer: userAnswer?.answer || '', isCorrect };
        });

        const score = (correctCount / lesson.quizData.questions.length) * 100;
        const passed = score >= lesson.quizData.passingScore;

        const submission = await Submission.create({
            user: req.user._id, course: courseId, lesson: lessonId,
            tenant: req.tenant._id, type: 'quiz', answers: gradedAnswers, score,
            status: passed ? 'passed' : 'failed'
        });

        if (passed) {
            const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId, tenant: req.tenant._id });
            if (enrollment) {
                if (!enrollment.completedLessons.includes(lessonId)) {
                    enrollment.completedLessons.push(lessonId);
                    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0) + (course.lessons?.length || 0);
                    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
                    if (enrollment.progress === 100) enrollment.status = 'completed';
                    await enrollment.save();
                }
            }
        }

        res.status(200).json({ score, passed, submissionId: submission._id, totalQuestions: lesson.quizData.questions.length, correctCount });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quiz' });
    }
};

const submitAssignment = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const { content, fileUrl, fileName } = req.body;
    try {
        const course = await Course.findOne({ _id: courseId, tenant: req.tenant._id });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
        if (!enrollment) return res.status(403).json({ message: 'Enrollment required' });

        const submission = await Submission.create({
            user: req.user._id, course: courseId, lesson: lessonId, tenant: req.tenant._id,
            type: 'assignment', content, fileUrl, fileName, status: 'pending-review'
        });
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment' });
    }
};

const gradeAssignment = async (req, res) => {
    const { score, feedback } = req.body;
    try {
        const submission = await Submission.findById(req.params.id).populate('course');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        if (submission.course.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        submission.score = score;
        submission.feedback = feedback;
        submission.status = score >= 70 ? 'passed' : 'failed';
        submission.gradedBy = req.user._id;
        await submission.save();

        if (submission.status === 'passed') {
            const enrollment = await Enrollment.findOne({ user: submission.user, course: submission.course._id, tenant: submission.tenant });
            if (enrollment) {
                if (!enrollment.completedLessons.includes(submission.lesson)) {
                    enrollment.completedLessons.push(submission.lesson);
                    const course = submission.course;
                    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0) + (course.lessons?.length || 0);
                    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
                    if (enrollment.progress === 100) enrollment.status = 'completed';
                    await enrollment.save();
                }
            }
        }
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error grading' });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user._id, tenant: req.tenant._id });
        const courseIds = courses.map(c => c._id);
        const submissions = await Submission.find({ course: { $in: courseIds }, tenant: req.tenant._id })
            .populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions' });
    }
};

const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user._id, tenant: req.tenant._id })
            .populate('course', 'title').sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your submissions' });
    }
};

// --- Payment & Orders Logic ---

const submitOfflinePayment = async (req, res) => {
    try {
        const { courseId, transactionId, paymentMethod, amount } = req.body;
        const existingOrder = await Order.findOne({ user: req.user._id, course: courseId, status: 'pending' });
        if (existingOrder) return res.status(400).json({ message: 'Pending request exists' });

        const order = await Order.create({
            user: req.user._id, course: courseId, tenant: req.tenant._id,
            amount, paymentMethod, transactionId, status: 'pending'
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingPayments = async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user._id, tenant: req.tenant._id });
        const courseIds = courses.map(c => c._id);
        const orders = await Order.find({ course: { $in: courseIds }, status: 'pending', tenant: req.tenant._id })
            .populate('user', 'name email').populate('course', 'title');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('course');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.course.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.status = status;
        order.verifiedBy = req.user._id;
        await order.save();

        if (status === 'completed') {
            let enrollment = await Enrollment.findOne({ user: order.user, course: order.course._id });
            if (!enrollment) {
                await Enrollment.create({ user: order.user, course: order.course._id, tenant: order.tenant, status: 'active' });
            }
        }
        res.json({ message: `Payment ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id, tenant: req.tenant._id })
            .populate('course', 'title price image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses, getCourse, createCourse, updateCourse, deleteCourse,
    submitQuiz, submitAssignment, gradeAssignment, getSubmissions, getMySubmissions,
    submitOfflinePayment, getPendingPayments, verifyPayment, getMyOrders
};
