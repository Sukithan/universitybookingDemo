const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Availability route
router.get('/availability', async (req, res) => {
    const { facility, date } = req.query;

    try {
        // Fetch existing bookings for the given facility and date
        const bookings = await Booking.find({ facility, date });

        // Define available time slots (adjust as needed)
        const allTimeSlots = [];
        for (let hour = 6; hour < 24; hour++) {
            allTimeSlots.push(`${hour}:00 - ${hour + 1}:00`);
        }

        // Filter out booked slots
        const bookedSlots = bookings.map(booking => booking.slot);
        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        res.json({ availableSlots, bookedSlots });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ message: 'Server error fetching availability' });
    }
});

// Create a new booking
router.post('/', async (req, res) => {
    const { universityId, facility, date, slot, members } = req.body;

    try {
        // Validate University ID
        if (!universityId.match(/^\d{6}[a-zA-Z]$/)) {
            throw new Error('University ID format is invalid');
        }

        // Validate number of members
        if (members > 10) {
            throw new Error('Number of members cannot exceed 10');
        }

        // Calculate endTime based on slot
        const [startTime, endTime] = slot.split(' - ');
        
        // Create a new booking record
        const newBooking = new Booking({
            universityId,
            facility,
            date,
            slot,
            members,
            endTime // Set endTime based on the end time of the slot
        });

        // Save the new booking to the database
        await newBooking.save();

        res.status(201).json({ success: true, message: 'Booking confirmed' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
