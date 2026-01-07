const mongoose = require('mongoose');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const rebrand = async () => {
    try {
        let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';
        await mongoose.connect(uri);
        console.log('Connected to DB for rebranding...');

        // 1. Update Tenant
        const tenant = await Tenant.findOneAndUpdate(
            {}, // Update first tenant found (fallback)
            {
                name: 'HaxoAcademy',
                subdomain: 'haxo',
                branding: {
                    primaryColor: '#6366f1',
                    secondaryColor: '#111827'
                }
            },
            { new: true }
        );
        console.log(`Rebranded Tenant: ${tenant.name} (${tenant.subdomain})`);

        // 2. Update Instructor Emails to @haxotech.com for those that look like academy
        const instructors = await User.find({ role: 'instructor', email: /@academy\.com$/ });
        for (let inst of instructors) {
            const newEmail = inst.email.replace('@academy.com', '@haxotech.com');
            inst.email = newEmail;
            await inst.save();
            console.log(`Updated Instructor Email: ${newEmail}`);
        }

        // 3. Update Student Emails
        const students = await User.find({ role: 'student', email: /@academy\.com$/ });
        for (let stud of students) {
            const newEmail = stud.email.replace('@academy.com', '@haxotech.com');
            stud.email = newEmail;
            await stud.save();
            console.log(`Updated Student Email: ${newEmail}`);
        }

        console.log('Rebranding successful!');
        process.exit(0);
    } catch (err) {
        console.error('Rebranding failed:', err);
        process.exit(1);
    }
};

rebrand();
