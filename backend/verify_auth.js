const http = require('http');

const postRequest = (path, data, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const getRequest = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('1. Registering User...');
        const user = JSON.stringify({
            name: 'Test Verify',
            email: `verify_${Date.now()}@example.com`,
            password: 'password123'
        });

        const regRes = await postRequest('/api/auth/register', user);
        console.log('Register Status:', regRes.status);
        console.log('Register Body:', regRes.body);

        if (regRes.status !== 201) return;
        const token = regRes.body.token;

        console.log('\n2. Logging in...');
        const loginRes = await postRequest('/api/auth/login', user); // Reusing user json which has email/pass
        console.log('Login Status:', loginRes.status);
        // console.log('Login Body:', loginRes.body);

        console.log('\n3. Getting Me...');
        const meRes = await getRequest('/api/auth/me', token);
        console.log('Me Status:', meRes.status);
        console.log('Me Body:', meRes.body);

    } catch (err) {
        console.error('Test Failed:', err);
    }
};

// Wait for server to start roughly
setTimeout(runTests, 2000);
