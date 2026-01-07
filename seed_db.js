const seedData = async () => {
    try {
        // Connect (Logic duplicated from server.js for standalone script)
        // ideally we'd export connectDB but for script simplicity we redo it or assume server handles it?
        // Actually, since memory server is ephemeral, we need to run this function INSIDE server.js or hit an endpoint.
        // Standalone script won't connect to the SAME memory instance unless we hit the API.

        // BETTER APPROACH: Use Axios to hit the register/create endpoints!
        // This ensures we populate the RUNNING memory server.

        console.log("Seeding via API...");
        const axios = require('axios');
        const api = axios.create({ baseURL: 'http://localhost:5000/api' });

        // 1. Create Instructor
        console.log("Creating Instructor...");
        let instructorToken;
        try {
            const res = await api.post('/auth/register', {
                name: 'Seed Instructor',
                email: 'instructor@seed.com',
                password: 'password123',
                role: 'instructor'
            });
            instructorToken = res.data.token;
        } catch (e) {
            console.log("Instructor likely exists:", e.response?.data?.message);
            // If exists, login
            const loginRes = await api.post('/auth/login', { email: 'instructor@seed.com', password: 'password123' });
            instructorToken = loginRes.data.token;
        }

        // 2. Create Student
        console.log("Creating Student...");
        try {
            await api.post('/auth/register', {
                name: 'Seed Student',
                email: 'student@seed.com',
                password: 'password123',
                role: 'student'
            });
        } catch (e) {
            console.log("Student likely exists");
        }

        // 3. Create Admin
        console.log("Creating Admin...");
        try {
            await api.post('/auth/register', {
                name: 'Seed Admin',
                email: 'admin@seed.com',
                password: 'password123',
                role: 'admin'
            });
        } catch (e) {
            console.log("Admin likely exists");
        }

        // 3. Create Courses
        const courses = [
            {
                title: 'Complete Web Design: Figma to Webflow',
                description: 'The full course on UI/UX Design.',
                category: 'Design',
                price: 19.99,
                image: 'https://images.unsplash.com/photo-1541462608143-df93b7409656?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                level: 'beginner',
                status: 'published',
                modules: [
                    {
                        title: 'Getting Started',
                        lessons: [
                            { title: 'Welcome to the Course', type: 'video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '5:00' },
                            { title: 'Project Overview', type: 'text', content: 'In this module, we will build a professional portfolio website.', duration: '10:00' }
                        ]
                    },
                    {
                        title: 'Figma Mastery',
                        lessons: [
                            { title: 'UI Fundamentals', type: 'video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00' }
                        ]
                    }
                ]
            },
            {
                title: 'The Complete JavaScript Masterclass',
                description: 'Master JavaScript with projects, challenges and theory.',
                category: 'Development',
                price: 24.99,
                image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                level: 'intermediate',
                status: 'published',
                modules: [
                    {
                        title: 'JavaScript Fundamentals',
                        lessons: [
                            { title: 'Values and Variables', type: 'video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:00' },
                            { title: 'Reading: Data Types', type: 'text', content: 'JavaScript has 8 basic data types.', duration: '5:00' }
                        ]
                    }
                ]
            }
        ];

        console.log("Creating Courses...");
        const config = { headers: { Authorization: `Bearer ${instructorToken}` } };

        for (const course of courses) {
            await api.post('/courses', course, config);
        }

        console.log("Seeding Complete!");

    } catch (err) {
        console.error(err);
    }
};

seedData();
