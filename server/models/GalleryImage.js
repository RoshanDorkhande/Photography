const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GalleryImageSchema = new Schema({
    id: { type: String, required: true, unique: true }, // Using String ID for flexibility (Cloudinary public_id or similar)
    serviceId: { type: String, required: true },
    src: { type: String, required: true },
    caption: { type: String }
});

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);
