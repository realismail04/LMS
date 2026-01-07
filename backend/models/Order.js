const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant',
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true, // e.g., 'Bank Transfer', 'Mobile Money'
    },
    transactionId: {
        type: String, // User provided proof or reference
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin/Instructor who approved
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
