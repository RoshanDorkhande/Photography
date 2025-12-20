const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tags: { type: String, required: true }
});

module.exports = mongoose.model('Service', ServiceSchema);
