const axios = require('axios');
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const testAdmin = async () => {
    try {
        console.log("Logging in as admin...");
        const loginRes = await api.post('/auth/login', {
            email: 'admin@seed.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log("Login successful. Token acquired.");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("Fetching system stats...");
        const statsRes = await api.get('/users/stats', config);
        console.log("Stats:", JSON.stringify(statsRes.data, null, 2));

        console.log("Fetching user list...");
        const usersRes = await api.get('/users', config);
        console.log(`Found ${usersRes.data.length} users.`);

        if (usersRes.data.length > 0) {
            console.log("Verification SUCCESS: Admin API is working and data exists.");
        } else {
            console.log("Verification WARNING: Admin API works but data list is empty.");
        }

    } catch (error) {
        console.error("Verification FAILED:", error.response?.data?.message || error.message);
    }
};

testAdmin();
