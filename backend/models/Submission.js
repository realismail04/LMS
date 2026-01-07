const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
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
        required: true // This refers to the lesson ID within the course modules
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    type: {
        type: String,
        enum: ['quiz', 'assignment'],
        required: true
    },
    answers: [{
        questionId: String,
        answer: String,
        isCorrect: Boolean
    }],
    content: String, // For text assignments
    fileUrl: String, // For file uploads
    fileName: String,
    score: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['passed', 'failed', 'pending-review', 'completed'],
        default: 'completed'
    },
    feedback: String,
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Ensure a user can't have duplicate submissions for the same lesson if we want to restrict attempts (optional)
// submissionSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
