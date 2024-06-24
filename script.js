document.addEventListener('DOMContentLoaded', function() {
    const checkAvailabilityBtn = document.getElementById('check-availability-btn');
    const timeSlotsContainer = document.getElementById('time-slots');
    const bookingSection = document.getElementById('booking');
    const bookingForm = document.getElementById('booking-form');
    const header = document.querySelector('header h1');

    checkAvailabilityBtn.addEventListener('click', () => {
        const facility = document.getElementById('facility').value;
        const date = document.getElementById('date').value;
        if (facility && date) {
            fetch(`http://localhost:3000/api/bookings/availability?facility=${facility}&date=${date}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.availableSlots && data.bookedSlots) {
                        showTimeSlots(data.availableSlots, data.bookedSlots);
                    } else {
                        alert('No available slots found. Please try again later.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching availability:', error);
                    alert('Error fetching availability. Please try again later.');
                });
        } else {
            alert('Please select both a facility and a date.');
        }
    });

    function showTimeSlots(availableSlots, bookedSlots) {
        timeSlotsContainer.innerHTML = ''; // Clear existing slots
    
        availableSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('time-slot');
            slotDiv.textContent = slot;
    
            if (bookedSlots.includes(slot)) {
                slotDiv.classList.add('booked'); // Add 'booked' class to booked slots
                slotDiv.addEventListener('click', () => {
                    alert('This time slot is already booked. Please select another slot.');
                });
            } else {
                slotDiv.addEventListener('click', () => {
                    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
                    slotDiv.classList.add('selected');
                    document.getElementById('selected-slot').value = slot; // Set the selected slot as a hidden input value
                });
            }
            timeSlotsContainer.appendChild(slotDiv);
        });
    
        // Show booking section
        bookingSection.style.display = 'block';
    }

    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const universityId = document.getElementById('university-id').value;
        const members = document.getElementById('members').value;
        const selectedSlot = document.getElementById('selected-slot').value;
    
        if (!selectedSlot) {
            alert('Please select a time slot.');
            return;
        }
    
        // Validate University ID
        if (!universityId.match(/^\d{6}[a-zA-Z]$/)) {
            alert('University ID format is invalid. It should be 6 digits followed by a letter.');
            return;
        }

        // Validate number of members
        if (members > 10) {
            alert('Number of members cannot exceed 10.');
            return;
        }

        const facility = document.getElementById('facility').value;
        const date = document.getElementById('date').value;
    
        const bookingData = {
            universityId,
            facility,
            date,
            slot: selectedSlot,
            members
        };
    
        fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Booking confirmed!');
                // Redirect to booking-details.html with booking details
                const bookingDetailsUrl = `booking-details.html?universityId=${universityId}&date=${date}&selectedSlot=${selectedSlot}&members=${members}`;
                window.location.href = bookingDetailsUrl;
            } else {
                alert('Booking failed. Please try again.');
            }
        })
        .catch(error => console.error('Error submitting booking:', error));
    });
});
