const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['video', 'text', 'quiz'],
        default: 'video',
    },
    content: {
        type: String, // Text content
    },
    videoUrl: {
        type: String, // URL for video
    },
    fileUrl: {
        type: String, // PDF or attachment
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
