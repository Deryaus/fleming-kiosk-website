//let inactivityTimeout;
//let timeoutLength = 300000; // 30 seconds // 300000 5 minutes for testing
let keyboard;
let shiftActive = false;

/**
 * Resets the inactivity timeout timer. When the timer expires, redirects to the welcome page.
 * Clears any existing timeout before setting a new one.
 * The timeout duration is controlled by the timeoutLength variable.
 * The welcome URL is retrieved from the 'data-welcome-url' attribute of the document body.
 */
function resetInactivityTimeout() {
    let timeoutLength = 300000; // 5 minutes
    let inactivityTimeout;
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


/**
 * Handles the 'Enter' key press event on the chat input field.
 * When the 'Enter' key is pressed, it sends the user input to the python function,
 * appends the user input and Python script response to the chat output, and clears the input field.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered by pressing Enter.
 */
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
            //chatOutput.value += `${data.response}\n\n`;
            // scroll to the bottom of the chat output
            //chatOutput.scrollTop = chatOutput.scrollHeight;
            typeEffect(data.response + '\n\n', chatOutput);
        });       
        // Clear the input field
        document.getElementById('chat-input').value = '';
        keyboard.setInput(''); // Clear Virtual keyboard input
    }
}

function startRecording() {
    let timeoutLength = 2000; // 2 seconds
    const micButton = document.querySelector('.mic-btn');
    const chatOutput = document.getElementById('chat-output');
    // Change to red while recording and disable button
    micButton.style.backgroundColor = '#dc3545';
    micButton.disabled = true;
    // make a call to the python script
    fetch('/record-audio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    // use a promise to get the response
    .then(response => response.json())
    .then(data => {
        // Wait for recording time before showing results
        setTimeout(() => {
            // Reset button color and re-enable button
            micButton.disabled = false;
            micButton.style.backgroundColor = '#007bff';
            // Show the conversation
            chatOutput.value += `Question: ${data.userInput}\n\n`;
            typeEffect(data.output + '\n\n', chatOutput);
        }, timeoutLength);
    });
}

/**
 * Simulates a typing effect by incrementally adding characters from a given text to an element's value.
 *
 * @param {string} text - The text to be typed out.
 * @param {HTMLTextAreaElement} element - The HTML element where the text will be displayed.
 */
function typeEffect(text, element) {
    let i = 0;
    const typeSpeed = 25; // milliseconds per character
    
    function type() {
        if (i < text.length) {
            element.value += text.charAt(i);
            // Scroll to the bottom of the chat output
            element.scrollTop = element.scrollHeight;
            i++;
            setTimeout(type, typeSpeed);
        }
    }
    type();
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#chat-input');
    keyboard = new SimpleKeyboard.default({
        onChange: input => handleKeyboardInput(input),
        onKeyPress: button => handleKeyPress(button),
        layout: {
            default: [
                '1 2 3 4 5 6 7 8 9 0 {bksp}',
                'q w e r t y u i o p',
                'a s d f g h j k l',
                '{shift} z x c v b n m . ?',
                '@ .com {space} {enter}'
            ],
            shift: [
                '! 2 3 4 5 6 7 8 9 0 {bksp}',
                'Q W E R T Y U I O P',
                'A S D F G H J K L',
                '{shift} Z X C V B N M ? .',
                '@ .com {space} {enter}'
            ]
        },
        display: {
            '{enter}': 'Enter',
            '{bksp}': 'Backspace',
            '{space}': ' ',
            '{shift}': 'Shift'
        }
    });

    // Show keyboard when chat input is focused
    input.addEventListener('focus', () => {
        const keyboard = document.querySelector('.simple-keyboard');
        keyboard.classList.add('keyboard-visible');
    });
    
    // Hide keyboard when mouse click outside of chat input
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.simple-keyboard') && event.target !== input && !event.target.closest('.hg-button')) {
            const keyboard = document.querySelector('.simple-keyboard');
            keyboard.classList.remove('keyboard-visible');
        }
    });

});

function handleKeyboardInput(input) {
    document.querySelector('#chat-input').value = input;
}
//TODO Fix The Shift Functionality
function handleKeyPress(button) {
    //let shiftActive = false;
    if (button === '{enter}') {
        const event = new KeyboardEvent('keypress', {'key': 'Enter'}); // Create a new 'Enter' key press event
        handleEnterKey(event);
    }
    if (button === '{shift}') {
        handleShift();
    }
}
function handleShift() {
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
    keyboard.setOptions({
        layoutName: shiftToggle
    });
}