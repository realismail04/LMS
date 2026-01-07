const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    subdomain: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    branding: {
        logo: String,
        primaryColor: {
            type: String,
            default: '#4f46e5' // indigo-600
        },
        secondaryColor: {
            type: String,
            default: '#1f2937' // gray-800
        },
        favicon: String
    },
    settings: {
        allowPublicRegistration: {
            type: Boolean,
            default: true
        },
        customDomain: String,
        contactEmail: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
