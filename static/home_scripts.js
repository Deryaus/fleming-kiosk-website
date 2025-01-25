let inactivityTimeout;
let timeoutLength = 300000; // 30 seconds // 300000 5 minutes for testing

/**
 * Resets the inactivity timeout timer. When the timer expires, redirects to the welcome page.
 * Clears any existing timeout before setting a new one.
 * The timeout duration is controlled by the timeoutLength variable.
 * The welcome URL is retrieved from the 'data-welcome-url' attribute of the document body.
 */
function resetInactivityTimeout() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        window.location.href = document.body.getAttribute('data-welcome-url');
    }, timeoutLength);
}

/**
 * Displays a specific section while hiding all other sections in the content area.
 * Used for navigation between different views in the kiosk interface.
 * 
 * @param {string} sectionId - The ID of the section element to display
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
    resetInactivityTimeout();
}

/**
 * Event Listener for the 'DOMContentLoaded' event.
 * Attaches event listeners for mousemove and keypress events to reset the inactivity timeout.

 */
document.addEventListener('DOMContentLoaded', () => {
    resetInactivityTimeout();
    document.addEventListener('mousemove', resetInactivityTimeout);
    document.addEventListener('keypress', resetInactivityTimeout);
});


function handleEnterKey(event) {
    if (event.key === 'Enter') {
        const userInput = document.getElementById('chat-input').value;
        const chatOutput = document.getElementById('chat-output');

        // Add the user input to the chat output
        chatOutput.value += `Question: ${userInput}\n\n`;

        // Make call to python script
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: userInput}),
        })
        // use a promise to get the response
        .then(response => response.json())
        .then(data => {
            // Add the response to the chat output
            chatOutput.value += `${data.response}\n`;
            // scroll to the bottom of the chat output
            chatOutput.scrollTop = chatOutput.scrollHeight;
        });       
        // Clear the input field
        document.getElementById('chat-input').value = '';
    }
}