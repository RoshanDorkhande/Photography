const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HeroSchema = new Schema({
    title1: { type: String, default: "Capture" },
    title2: { type: String, default: "Timeless" },
    subtitle1: { type: String, default: "The Unseen" },
    subtitle2: { type: String, default: "Moments" }
});

module.exports = mongoose.model('Hero', HeroSchema);
