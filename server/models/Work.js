const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    img: { type: String, required: true }, // URL
    imgPublicId: { type: String }, // Cloudinary Public ID
    cat: { type: String, required: true },
    title: { type: String, required: true },
    serviceId: { type: String } // Link to a service (optional)
});

module.exports = mongoose.model('Work', WorkSchema);
