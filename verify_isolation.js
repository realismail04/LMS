const axios = require('axios');
const api = axios.create({ baseURL: 'http://localhost:5000/api', validateStatus: false });

const verifyIsolation = async () => {
    try {
        console.log("--- Multi-tenancy Isolation Test ---");

        // 1. Fetch courses without tenant context
        console.log("Test 1: Fetching courses without tenant header...");
        const res1 = await api.get('/courses');
        console.log("Status:", res1.status);
        console.log("Message:", res1.data.message);
        if (res1.status === 400) console.log("SUCCESS: Request rejected as expected.");

        // 2. Fetch courses with correct tenant header
        console.log("\nTest 2: Fetching courses with 'X-Tenant-Subdomain: main'...");
        const res2 = await api.get('/courses', { headers: { 'X-Tenant-Subdomain': 'main' } });
        console.log("Status:", res2.status);
        console.log("Courses Found:", res2.data.length);
        if (res2.status === 200 && res2.data.length > 0) console.log("SUCCESS: Courses retrieved for valid tenant.");

        // 3. Register user in Tenant A and try login in Tenant B (Isolation)
        console.log("\nTest 3: Cross-tenant login isolation...");
        // First, create Tenant B
        await api.post('/tenants', { name: 'Tenant B', subdomain: 'tenantb' });

        // Try to login to Tenant B with credentials from 'main' tenant
        const res3 = await api.post('/auth/login',
            { email: 'student@seed.com', password: 'password123' },
            { headers: { 'X-Tenant-Subdomain': 'tenantb' } }
        );
        console.log("Status:", res3.status);
        console.log("Message:", res3.data.message);
        if (res3.status === 401 || res3.status === 400) console.log("SUCCESS: Cross-tenant login blocked.");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyIsolation();
