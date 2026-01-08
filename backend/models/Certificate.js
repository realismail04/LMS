const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
