const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutSchema = new Schema({
    bio1: { type: String, default: "Founded in 2020, Skyline Films is a creative studio dedicated to capturing the unseen moments that define our lives." },
    bio2: { type: String, default: "We believe in the power of visual storytelling to evoke emotion and preserve memories." },
    bio3: { type: String, default: "Our team of passionate photographers and filmmakers work tirelessly to deliver cinematic quality in every frame." },
    email: { type: String, default: "contact@skylinefilms.com" },
    instagram: { type: String, default: "@skylinefilms" },
    img: { type: String, default: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=1000" },
    imgPublicId: { type: String }, // Cloudinary Public ID
    signatureName: { type: String, default: "Hemant Ekre" },
    signatureRole: { type: String, default: "Founder" }
});

module.exports = mongoose.model('About', AboutSchema);
