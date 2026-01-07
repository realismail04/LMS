const axios = require('axios');
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const testInstructor = async () => {
    try {
        console.log("Logging in as instructor...");
        const loginRes = await api.post('/auth/login', {
            email: 'instructor@seed.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log("Login successful.");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("Fetching instructor stats...");
        const statsRes = await api.get('/enrollments/instructor/stats', config);
        console.log("Stats:", JSON.stringify(statsRes.data, null, 2));

        console.log("Fetching instructor enrollments...");
        const enrollRes = await api.get('/enrollments/instructor/enrollments', config);
        console.log(`Found ${enrollRes.data.length} recent enrollments.`);

        if (enrollRes.data.length > 0) {
            console.log("First enrollment user:", enrollRes.data[0].user.name);
            console.log("First enrollment course:", enrollRes.data[0].course.title);
        }

        console.log("Verification SUCCESS: Instructor API is working.");

    } catch (error) {
        console.error("Verification FAILED:", error.response?.data?.message || error.message);
    }
};

testInstructor();
