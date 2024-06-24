document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get('universityId');
    const date = params.get('date');
    const members = params.get('members');
    const selectedSlot = params.get('selectedSlot');

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <p><strong>University ID:</strong> ${universityId}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Selected Slot:</strong> ${selectedSlot}</p>
        <p><strong>Number of Members:</strong> ${members}</p>
    `;

    // Adding some colorful styles
    detailsDiv.style.backgroundColor = '#fff3cd';
    detailsDiv.style.border = '1px solid #ffeeba';
    detailsDiv.style.padding = '1rem';
    detailsDiv.style.borderRadius = '4px';
    detailsDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

    document.getElementById('new-booking-btn').addEventListener('click', function() {
        window.location.href = 'basic.html';
    });
});
