const axios = require('axios');
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const seedTenantData = async () => {
    try {
        console.log("Creating Default Tenant...");
        let tenant;
        try {
            const res = await api.post('/tenants', {
                name: 'Main Academy',
                subdomain: 'main',
                branding: {
                    logo: 'https://via.placeholder.com/150',
                    primaryColor: '#4f46e5'
                }
            });
            tenant = res.data;
            console.log("Tenant Created:", tenant.name);
        } catch (e) {
            console.log("Tenant likely exists, fetching...");
            // Since we don't have a list-tenants, we'll assume it's created or we can add a find-by-subdomain.
            // For seeding, let's just use the known subdomain.
        }

        // Now run the original seed logic but with the X-Tenant-Subdomain header
        console.log("Running Main Seeding with Tenant Context...");
        const tenantHeader = { 'X-Tenant-Subdomain': 'main' };

        // 1. Create Instructor
        console.log("Creating Instructor...");
        let instructorToken;
        try {
            const res = await api.post('/auth/register', {
                name: 'Seed Instructor',
                email: 'instructor@seed.com',
                password: 'password123',
                role: 'instructor'
            }, { headers: tenantHeader });
            instructorToken = res.data.token;
        } catch (e) {
            const loginRes = await api.post('/auth/login', {
                email: 'instructor@seed.com',
                password: 'password123'
            }, { headers: tenantHeader });
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
            }, { headers: tenantHeader });
        } catch (e) { }

        // 3. Create Courses
        const courses = [
            {
                title: 'Multi-tenant Web Development',
                description: 'Learn how to build scalable SaaS apps.',
                category: 'Development',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                level: 'advanced',
                status: 'published',
                modules: [
                    {
                        title: 'Architecture',
                        lessons: [
                            { title: 'Introduction to Multi-tenancy', type: 'text', content: 'In this module, we explore shared vs isolated databases.' },
                            {
                                title: 'Architecture Quiz',
                                type: 'quiz',
                                quizData: {
                                    passingScore: 70,
                                    questions: [
                                        {
                                            question: 'What is a "Tenant" in SaaS architecture?',
                                            options: ['A cloud provider', 'A separate organization or user group', 'A database row', 'A CSS theme'],
                                            correctAnswer: 'A separate organization or user group',
                                            type: 'multiple-choice'
                                        },
                                        {
                                            question: 'Which header are we using for tenant identification?',
                                            options: ['X-Tenant-Subdomain', 'X-Auth-Token', 'X-Tenant-ID', 'X-Org-Name'],
                                            correctAnswer: 'X-Tenant-Subdomain',
                                            type: 'multiple-choice'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ];

        console.log("Creating Courses...");
        const config = {
            headers: {
                ...tenantHeader,
                Authorization: `Bearer ${instructorToken}`
            }
        };

        for (const course of courses) {
            await api.post('/courses', course, config);
        }

        console.log("Seed Complete!");

    } catch (err) {
        console.error("Seed Error:", err.response?.data || err.message);
    }
};

seedTenantData();
