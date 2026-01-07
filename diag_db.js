const mongoose = require('mongoose');
const Submission = require('./backend/models/Submission');
const Course = require('./backend/models/Course');
const Tenant = require('./backend/models/Tenant');

const check = async () => {
    try {
        // Since we use MongoMemoryServer in server.js, we can't easily connect to that local instance from a separate process 
        // unless we know the temporary URI.
        // Wait, the server logs said: Using In-Memory MongoDB: mongodb://127.0.0.1:52078/

        // However, I can check the server's stdout more carefully if I look at the command status again with more lines.
        console.log("Diag script started. Checking for Submissions...");

    } catch (e) {
        console.error(e);
    }
};

check();
