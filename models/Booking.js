const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    universityId: { type: String, required: true },
    facility: { type: String, required: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    endTime: { type: String, required: true },
    members: { type: Number, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
