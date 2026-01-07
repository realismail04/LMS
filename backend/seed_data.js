const User = require('./models/User');
const Course = require('./models/Course');
const Tenant = require('./models/Tenant');
const Enrollment = require('./models/Enrollment');
const Submission = require('./models/Submission');

/**
 * @desc    Seed all data into the connected database for HaxoAcademy
 */
const seedAllData = async () => {
    try {
        console.log('--- HaxoAcademy Seeding Started ---');

        // 1. Setup Tenant
        let tenant = await Tenant.findOne({ subdomain: 'haxo' });
        if (!tenant) {
            tenant = await Tenant.create({
                name: 'HaxoAcademy',
                subdomain: 'haxo',
                branding: {
                    primaryColor: '#6366f1',
                    secondaryColor: '#111827'
                }
            });
            console.log('Tenant "HaxoAcademy" created.');
        }

        // Also ensure the old 'academy' tenant is updated or handled if it exists
        await Tenant.updateOne({ subdomain: 'academy' }, { name: 'HaxoAcademy', subdomain: 'haxo' });

        // 2. Create Teachers
        const teachersData = [
            { name: 'Dr. Sarah Smith', email: 'sarah.smith@haxotech.com', password: 'password123', role: 'instructor', tenant: tenant._id },
            { name: 'Prof. James Wilson', email: 'james.wilson@haxotech.com', password: 'password123', role: 'instructor', tenant: tenant._id },
            { name: 'Alex Rivera', email: 'alex.rivera@haxotech.com', password: 'password123', role: 'instructor', tenant: tenant._id }
        ];

        const teachers = [];
        for (const t of teachersData) {
            let user = await User.findOne({ email: t.email });
            if (!user) user = await User.create(t);
            teachers.push(user);
        }
        console.log('Instructors ready.');

        // 3. Create Students
        const students = [];
        for (let i = 1; i <= 15; i++) {
            const email = `student${i}@haxotech.com`;
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name: `Student ${i}`,
                    email,
                    password: 'password123',
                    role: 'student',
                    tenant: tenant._id
                });
            }
            students.push(user);
        }
        console.log('15 Students ready.');

        // 4. Create Courses
        const coursesData = [
            {
                user: teachers[0]._id,
                tenant: tenant._id,
                title: 'Full-Stack Web Mastery',
                description: 'Master the entire stack from database to UI with React and Node.js. High-fidelity patterns included.',
                category: 'Development',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
                level: 'advanced',
                status: 'published',
                modules: [
                    {
                        title: 'Getting Started',
                        lessons: [
                            { title: 'System Architecture Overview', type: 'video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10:00' },
                            { title: 'Environment Setup', type: 'text', content: 'Follow the instructions below to set up your local development environment...' }
                        ]
                    },
                    {
                        title: 'Building the API',
                        lessons: [
                            { title: 'Express & Mongoose Integration', type: 'video', videoUrl: 'https://www.youtube.com/embed/SccSCuHhbcM', duration: '25:00' },
                            { title: 'JWT Security Task', type: 'assignment' }
                        ]
                    }
                ]
            },
            {
                user: teachers[1]._id,
                tenant: tenant._id,
                title: 'AI & Data Science Essentials',
                description: 'Intro to machine learning and big data in the HaxoTech ecosystem.',
                category: 'Data Science',
                price: 149.00,
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                level: 'beginner',
                status: 'published',
                modules: [
                    {
                        title: 'Python for Data Science',
                        lessons: [
                            { title: 'NumPy & Pandas Basics', type: 'video', videoUrl: 'https://www.youtube.com/embed/GPVsHOlRBBI', duration: '15:20' }
                        ]
                    }
                ]
            },
            {
                user: teachers[2]._id,
                tenant: tenant._id,
                title: 'HaxoDesign UI/UX Expert',
                description: 'Design beautiful, sleek interfaces that wow the world.',
                category: 'Design',
                price: 99.00,
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
                level: 'intermediate',
                status: 'published',
                modules: [
                    {
                        title: 'Design Foundations',
                        lessons: [
                            { title: 'Color Theory', type: 'video', videoUrl: 'https://www.youtube.com/embed/_2LLXnUdUIc', duration: '18:45' }
                        ]
                    }
                ]
            }
        ];

        const courses = [];
        for (const c of coursesData) {
            let course = await Course.findOne({ title: c.title });
            if (!course) {
                course = await Course.create(c);
            }
            courses.push(course);
        }
        console.log('Sample Courses ready.');

        // 5. Activity Seeding
        for (const student of students) {
            const numEnroll = Math.floor(Math.random() * 2) + 1;
            const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
            const selectedCourses = shuffledCourses.slice(0, numEnroll);

            for (const course of selectedCourses) {
                let enrollment = await Enrollment.findOne({ user: student._id, course: course._id });
                if (!enrollment) {
                    enrollment = await Enrollment.create({
                        user: student._id,
                        course: course._id,
                        tenant: tenant._id,
                        progress: Math.floor(Math.random() * 100),
                        status: 'active'
                    });

                    // Randomly add a submission
                    if (Math.random() > 0.4) {
                        const lesson = course.modules[0].lessons[0];
                        await Submission.create({
                            user: student._id,
                            course: course._id,
                            lesson: lesson._id,
                            tenant: tenant._id,
                            type: 'assignment',
                            content: 'Practice work submitted.',
                            status: 'pending-review'
                        });
                    }
                }
            }
        }

        console.log('--- HaxoAcademy Seeding Completed ---');
    } catch (error) {
        console.error('Seeding Failed:', error);
    }
};

module.exports = { seedAllData };
