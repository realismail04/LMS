const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment', 'live'],
        default: 'video'
    },
    content: { type: String }, // For text lessons
    videoUrl: { type: String }, // For video/live lessons
    duration: { type: String },
    resources: [{
        name: { type: String },
        url: { type: String }
    }],
    quizData: { type: mongoose.Schema.Types.Mixed }, // Placeholder for quiz structure
}, { timestamps: true });

const moduleSchema = mongoose.Schema({
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lessons: [lessonSchema],
}, { timestamps: true });

const courseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    image: {
        type: String,
        required: [true, 'Please add a course image'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0.0,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    modules: [moduleSchema],
    // Legacy support for backward compatibility during transition
    lessons: [lessonSchema],
    rating: {
        type: Number,
        required: true,
        default: 4.5,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    studentsCount: {
        type: Number,
        required: true,
        default: 0,
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
