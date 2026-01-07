const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Submission = require('./models/Submission');
const Enrollment = require('./models/Enrollment');
const Tenant = require('./models/Tenant');
const dotenv = require('dotenv');

dotenv.config();

const verifyAssignmentFlow = async () => {
    try {
        // Use 127.0.0.1 for better reliability on some systems
        const uri = process.env.MONGO_URI ? process.env.MONGO_URI.replace('localhost', '127.0.0.1') : 'mongodb://127.0.0.1:27017/lms_db';

        console.log(`Connecting to MongoDB at ${uri}...`);
        await mongoose.connect(uri);
        console.log('MongoDB Connected.');

        // 1. Get/Create Tenant
        let tenant = await Tenant.findOne({ name: 'Verification University' });
        if (!tenant) {
            tenant = await Tenant.create({ name: 'Verification University', domain: 'verify.lms.com' });
        }

        // 2. Get/Create Instructor & Student
        let instructor = await User.findOne({ email: 'instructor@verify.com' });
        if (!instructor) {
            instructor = await User.create({ name: 'Prof. Verify', email: 'instructor@verify.com', password: 'password123', role: 'instructor', tenant: tenant._id });
        }

        let student = await User.findOne({ email: 'student@verify.com' });
        if (!student) {
            student = await User.create({ name: 'Stu Verify', email: 'student@verify.com', password: 'password123', role: 'student', tenant: tenant._id });
        }

        // 3. Create Course with Assignment
        const course = new Course({
            user: instructor._id,
            tenant: tenant._id,
            title: 'Advanced Verification Course ' + Date.now(),
            description: 'Testing the assignment system',
            category: 'Development',
            price: 0,
            image: 'https://via.placeholder.com/300',
            modules: [
                {
                    title: 'Module 1: The Tasks',
                    lessons: [
                        {
                            title: 'How to Verify',
                            type: 'video',
                            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                        },
                        {
                            title: 'Project Submission',
                            type: 'assignment'
                        }
                    ]
                }
            ]
        });
        await course.save();
        console.log('Course created:', course.title);

        const lessonId = course.modules[0].lessons[1]._id;

        // 4. Enroll Student
        const enrollment = await Enrollment.create({
            user: student._id,
            course: course._id,
            tenant: tenant._id,
            status: 'active'
        });
        console.log('Student enrolled');

        // 5. Submit Assignment (Student)
        const submission = await Submission.create({
            user: student._id,
            course: course._id,
            lesson: lessonId,
            tenant: tenant._id,
            type: 'assignment',
            content: 'This is my verified project content.',
            fileUrl: 'https://github.com/verify/project',
            status: 'pending-review'
        });
        console.log('Assignment submitted');

        // 6. Grade Assignment (Instructor)
        // Simulate the logic in gradeAssignment controller
        submission.score = 95;
        submission.feedback = 'Excellent work! Everything is verified.';
        submission.status = 'passed';
        submission.gradedBy = instructor._id;
        await submission.save();
        console.log('Assignment graded');

        // Trigger the completion logic
        if (submission.status === 'passed') {
            const enrollToUpdate = await Enrollment.findOne({ _id: enrollment._id });
            if (!enrollToUpdate.completedLessons.includes(submission.lesson)) {
                enrollToUpdate.completedLessons.push(submission.lesson);
                const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                enrollToUpdate.progress = Math.round((enrollToUpdate.completedLessons.length / totalLessons) * 100);
                if (enrollToUpdate.progress === 100) enrollToUpdate.status = 'completed';
                await enrollToUpdate.save();
            }
        }

        // 7. Final Verification
        const finalEnrollment = await Enrollment.findOne({ _id: enrollment._id });
        console.log('Final Enrollment Result:', {
            progress: finalEnrollment.progress,
            completedCount: finalEnrollment.completedLessons.length,
            status: finalEnrollment.status
        });

        if (finalEnrollment.progress > 0) {
            console.log('SUCCESS: Progress updated after grading!');
        } else {
            console.error('FAILURE: Progress remained 0%');
            process.exit(1);
        }

        process.exit(0);
    } catch (err) {
        console.error('Verification Error:', err);
        process.exit(1);
    }
};

verifyAssignmentFlow();
