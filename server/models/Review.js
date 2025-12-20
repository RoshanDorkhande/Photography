const mongoose = require('mongoose');

const CheckSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    avatar: {
        type: String, // URL to image
        required: false
    },
    avatarPublicId: { type: String } // Cloudinary Public ID
});

module.exports = mongoose.model('Review', CheckSchema);
