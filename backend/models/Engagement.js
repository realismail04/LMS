const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
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
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    type: {
        type: String,
        enum: ['view', 'completion', 'time-spent', 'quiz-start', 'quiz-submit'],
        required: true
    },
    duration: {
        type: Number, // duration in seconds for 'time-spent' or video progress
        default: 0
    },
    metadata: {
        device: String,
        browser: String,
        os: String
    }
}, { timestamps: true });

// Index for performant aggregation
engagementSchema.index({ tenant: 1, course: 1, type: 1 });
engagementSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Engagement', engagementSchema);
