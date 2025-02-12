let inactivityTimeout;
let timeoutLength;
let currentQuestion;
let quizQuestions;
/**
 * Resets the inactivity timeout timer. When the timer expires, redirects to the welcome page.
 * Clears any existing timeout before setting a new one.
 * The timeout duration is controlled by the timeoutLength variable.
 * The welcome URL is retrieved from the 'data-welcome-url' attribute of the document body.
 */
function resetInactivityTimeout() {
    let timeoutLength = 300000; // 5 minutes //TODO change this for deployment
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
 * Initializes the virtual keyboard on the chat input field.
 * Updates the calendar image source to the current date.
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    fetch('/static/json/quiz_questions.json')
        .then(response => response.json())
        .then(data => {
            quizQuestions = data;   
        });
    document.addEventListener('mousemove', resetInactivityTimeout);
    document.addEventListener('keypress', resetInactivityTimeout);
    initializeKeyboard('#chat-input');
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
        document.querySelector('.simple-keyboard').classList.remove('keyboard-visible');
        // Add the user input to the chat output
        chatOutput.value += `Question: ${userInput}\n\n`;
        // Make call to python script
        fetch('/chat',
         {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: userInput}),
        })
        // use a promise to get the response
        .then(response => response.json())
        .then(data => {
            chatOutput.value += 'Blaze: \n';  
            typeEffect(data.response + '\n\n', chatOutput, function() { 
                chatOutput.value += '──────────────────────────────────────────────────────────────────────────────────\n\n';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            chatOutput.value += 'Blaze \n Sorry, There was an error, Please try again \n\n';
        });
        // Clear the input field
        document.getElementById('chat-input').value = '';
        keyboard.setInput(''); // Clear Virtual keyboard input
    }
}

function startRecording() {
    const micButton = document.querySelector('.mic-btn');
    const chatOutput = document.getElementById('chat-output');
    // Change to red while recording and disable button
    micButton.style.backgroundColor = '#dc3545';
    micButton.disabled = true;
    chatOutput.value += 'Listening...\n';

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
        chatOutput.value = chatOutput.value.replace('Listening...\n', '');
        micButton.disabled = false;
        micButton.style.backgroundColor = '#007bff';
        //show the output
        chatOutput.value += `Question: ${data.user_input}\n\n`;
        chatOutput.value += `Blaze:\n\n`;
        typeEffect(data.output + '\n\n', chatOutput, function() { 
            chatOutput.value += '──────────────────────────────────────────────────────────────────────────────────\n\n';
        });
    })
    .catch(error => {
        console.error('Error:', error);
        chatOutput.value.replace('Listening...\n', '');
        chatOutput.value += 'Blaze: \n\n Sorry, There was an error with the microphone. Please try typing your question instead.';
        micButton.disabled = false;
        micButton.style.backgroundColor = '#004bff';
    });
}

// TODO: Functions for FAQ

document.addEventListener("DOMContentLoaded", function() {
    const responses = {
        "Where is the help desk located?": "The help desk is located in the C-Wing by the main entrance.",
        "Question 2": "Answer to Question 2",
        "Question 3": "Answer to Question 3"
    };
    
    const buttonContainer = document.querySelector(".left-faq");
    Object.keys(responses).forEach(question => {
        const button = document.createElement("button");
        button.textContent = question;
        button.classList.add("btn");
        button.onclick = function() { moveTextToResponse(this, responses); };
        buttonContainer.appendChild(button);
    });
});

function moveTextToResponse(button, responses) {
    document.getElementById("response-box").textContent = button.textContent;
    document.getElementById("answer-box").textContent = responses[button.textContent] || "No answer available";
    
    const buttons = document.querySelectorAll(".left-faq button");
    buttons.forEach(btn => {
        btn.disabled = true;
    });
    
    setTimeout(() => {
        buttons.forEach(btn => {
            btn.disabled = false;
        });
    }, 2000);
}


/**
 * Simulates a typing effect by incrementally adding characters from a given text to an element's value.
 *
 * @param {string} text - The text to be typed out.
 * @param {HTMLTextAreaElement} element - The HTML element where the text will be displayed.
 */
function typeEffect(text, element, callback) {
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
        else if (callback) {
            callback();
        }
    }
    type();
}


/**
 * Initializes a virtual keyboard for a specified input element.
 *
 * @param {string} inputSelector - The CSS selector for the input element to attach the keyboard to.
 * @param {string} [keyboardSelector='.simple-keyboard'] - The CSS selector for the keyboard element. Defaults to '.simple-keyboard'.
 */
function initializeKeyboard(inputSelector, keyboardSelector = '.simple-keyboard') {
    const input = document.querySelector(inputSelector);
    const keyboardElement = document.querySelector(keyboardSelector);
    
    keyboard = new SimpleKeyboard.default({
        onChange: input => handleKeyboardInput(input),
        onKeyPress: button => handleKeyPress(button),
        layout: {
            default: [
                '1 2 3 4 5 6 7 8 9 0 - {bksp}',
                'q w e r t y u i o p',
                'a s d f g h j k l',
                '{shift} z x c v b n m . ?',
                '@ .com {space} {enter}'
            ],
            shift: [
                '! @ # $ % ^ & * ( ) {bksp}',
                'Q W E R T Y U I O P',
                'A S D F G H J K L',
                '{shift} Z X C V B N M . ?',
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

    // Show keyboard when input is focused
    input.addEventListener('focus', () => {
        keyboardElement.classList.add('keyboard-visible');
    });

    // Hide keyboard when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest(keyboardSelector) && event.target !== input) {
            keyboardElement.classList.remove('keyboard-visible');
        }
    });
}

/**
 * Handles the virtual keyboard input by updating the chat input field with the input value.
 *
 * @param {string} input - The input value from the keyboard.
 */
function handleKeyboardInput(input) {
    document.querySelector('#chat-input').value = input;
}

/**
 * handles special key press events from the virtual keyboard.
 * Processes enter key to submit messages and shift key to toggle keyboard layout.
 * 
 * @param {string} button 
 */
function handleKeyPress(button) {
    const currentInput = document.activeElement;
    const isEmailInput = currentInput.id === 'email-input';
    const keyboardElement = document.querySelector('.simple-keyboard')
    if (button === '{enter}') {
        if (isEmailInput) {
            const event = new KeyboardEvent('keypress', {'key': 'Enter'});
            handleEmail(event);
        }
        else {    
        const event = new KeyboardEvent('keypress', {'key': 'Enter'}); // Create a new 'Enter' key press event
        handleEnterKey(event);
        }
    }
    else if (button === '{shift}') {
        handleShift();
    }
    else if (keyboard.options.layoutName === 'shift' && button !== '{bksp}' && button !== '{space}') {
        keyboard.setOptions({
            layoutName: 'default'
       });
       keyboardElement.classList.add('keyboard-visible');
    }
}
/**
 * Toggles the virtual keyboard layout between default and shift layouts.
 * and ensures the keyboard remains visible
 */
function handleShift() {
    const keyboardElement = document.querySelector('.simple-keyboard')
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
    keyboard.setOptions({
        layoutName: shiftToggle
    });
    keyboardElement.classList.add('keyboard-visible');
} 

function handleEmail() {
    //TODO function to handle email submit

}



function startQuiz() {
    currentQuestion = 0;
    const quizSection = document.getElementById('quiz-section');
    quizSection.style.display = 'block'; // display the quiz section
    document.getElementById('start-btn').style.display ='none';  // remove start quiz button 
    shuffleQuestions();
    showQuestion();
    // TODO text to speech here to play question

}

function showQuestion() {
    const question = quizQuestions.questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach((btn, index) => { // loop through buttons and add answers to each button
        btn.textContent = question.answers[index];
        btn.className = 'answer-btn';
        btn.disabled = false;
    });
    document.getElementById('feedback-section').style.display = 'none'; // hide feedback section
    document.getElementById('next-btn').style.display = 'none'; // hide next button untill answer is displayed
}  


function checkAnswer(answerIndex) {
    const question = quizQuestions.questions[currentQuestion];
    const feedbackSection = document.getElementById('feedback-section');
    const answerBtns = document.querySelectorAll('.answer-btn');
    // Disable all answer buttons until next question
    answerBtns.forEach(btn => {
        btn.disabled = true;
    });

    if (answerIndex === question.correct) {

        feedbackSection.textContent = 'Correct! Well done!';
        feedbackSection.style.backgroundColor = '#5ac774';
        feedbackSection.style.color = '#155724';
        answerBtns[answerIndex].classList.add('correct'); // hightlight the correct answer in green. 
    } else {
        feedbackSection.textContent = `Incorrect. The correct answer is: ${question.answers[question.correct]}`;
        feedbackSection.style.backgroundColor = '#f8d7da';
        feedbackSection.style.color = '#721c24';
        answerBtns[answerIndex].classList.add('incorrect'); // highlight the incorrect answer in red
        answerBtns[question.correct].classList.add('correct'); // hightlight the correct answer in green
    }
    feedbackSection.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < 6) {
        showQuestion();
        //TODO text to speech here to play question

    

    }
    else {
        // Hide quiz elements
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('answer-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';

        // Show completion message
        const quizSection = document.getElementById('quiz-section');
        const completionDiv = document.createElement('div');
        completionDiv.innerHTML = 
            `<h1>Quiz Complete!</h1>
            <button class="btn" id="start-btn" onclick="playAgain()">Play Again?</button>
            <p>Enter your email address below for a chance to win some Fleming Swag!</p>
            <p>one entry per person</p>`;
        quizSection.appendChild(completionDiv);

    }
}

function playAgain() {
    // Remove completion message
    const quizSection = document.getElementById('quiz-section');
    quizSection.removeChild(quizSection.lastChild);
    // Show quiz elements
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('answer-section').style.display = 'grid';
    // Start new quiz
    startQuiz();
}

function shuffleQuestions() {
    for (let i = quizQuestions.questions.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [quizQuestions.questions[i], quizQuestions.questions[random]] = 
        [quizQuestions.questions[random], quizQuestions.questions[i]];
    }
}
