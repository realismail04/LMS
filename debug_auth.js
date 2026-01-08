const mongoose = require('mongoose');
const Tenant = require('./backend/models/Tenant');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';

const verify = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const tenantCount = await Tenant.countDocuments();
        console.log(`Tenant Count: ${tenantCount}`);

        const tenants = await Tenant.find({});
        console.log('Tenants:', tenants.map(t => ({ id: t._id, name: t.name, subdomain: t.subdomain })));

        const userCount = await User.countDocuments();
        console.log(`User Count: ${userCount}`);

        if (tenantCount === 0) {
            console.log('CRITICAL: No tenants found! Registration will fail.');
        } else {
            // Simulate tenant resolution for 'academy'
            const academyTenant = await Tenant.findOne({ subdomain: 'academy' });
            console.log("Tenant with subdomain 'academy':", academyTenant ? 'FOUND' : 'NOT FOUND');

            // Simulate fallback
            const firstTenant = await Tenant.findOne({});
            console.log("Fallback Tenant:", firstTenant ? firstTenant.subdomain : 'NONE');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verify();
