const mongoose = require('mongoose');

const adminRequestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const AdminRequest = mongoose.model('AdminRequest', adminRequestSchema);
module.exports = AdminRequest;
