let inactivityTimeout;
let timeoutLength;
let currentQuestion;
let quizQuestions;
let isTalking = false;
let audioTimeout;
let audioEndTime = 0;

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
    const videoSection = document.getElementById('welcome-video-section');
    const welcomeVideo = document.getElementById('welcome-video');
    const targetSection = document.getElementById(sectionId);

    if (welcomeVideo) {
        // Stop video playback if video exists
        welcomeVideo.remove();
        // Remove video section immediately if user clicked a different section
        if (!welcomeVideo.ended) {
            videoSection.remove();
        }
        else if (welcomeVideo.ended) {
            videoSection.remove();
        }
    }
    if (targetSection.style.display === 'block') {
        return
    }
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.style.opacity = 0;
    });
    // Show target section
    targetSection.style.display = 'block';
    setTimeout(() => {
        targetSection.style.opacity = 1;
    }, 100);
}

/**
 * Event Listener for the 'DOMContentLoaded' event.
 * Attaches event listeners for mousemove and keypress events to reset the inactivity timeout.
 * Initializes the virtual keyboard on the chat input field.
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    const welcomeVideo = document.getElementById('welcome-video');

    welcomeVideo.volume = 0.3;
    fetch('/static/json/quiz_questions.json')
        .then(response => response.json())
        .then(data => {
            originalQuestions = structuredClone(data.questions);
            quizQuestions = {questions: structuredClone(data.questions)};   
        })
    .catch (error => console.error('Error loading quiz questions:', error));
    document.addEventListener('mousemove', resetInactivityTimeout);
    document.addEventListener('keypress', resetInactivityTimeout);
    initializeKeyboard('#chat-input');
});


function changeMap(map) {
    const mapImage = document.getElementById("map-image");
    const frostLevels = document.getElementById("frost-levels");

    if (map === "suther") {
        mapImage.src = mapImage.getAttribute("data-map-suther");
        frostLevels.style.display = "none";
    } else if (map === "frost") {
        mapImage.src = mapImage.getAttribute("data-map-frost-upper");
        frostLevels.style.display = "block"
    }
}

function changeFrostLevel(level) {
    const mapImage = document.getElementById("map-image");
    mapImage.src = mapImage.getAttribute(`data-map-frost-${level}`);
}

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
                chatOutput.value += '─────────────────────────────────────────────────────────────────────────────────────────────────────────\n\n';
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
    fetch("/static/json/FAQ_questions.json")
        .then(response => response.json())
        .then(responses => {
            const buttonContainer = document.querySelector(".left-faq");
            
            Object.keys(responses).forEach(question => {
                const button = document.createElement("button");
                button.textContent = question;
                button.classList.add("btn"); // Apply styling
                button.onclick = function() { moveTextToResponse(this, responses); };
                buttonContainer.appendChild(button);
            });
        })
        .catch(error => console.error("Error loading questions:", error));
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
    const keyboardElement = document.querySelector('.simple-keyboard');
    if (button === '{enter}') {
        const event = new KeyboardEvent('keypress', {'key': 'Enter'}); // Create a new 'Enter' key press event
        handleEnterKey(event);
    } else if (button === '{shift}') {
        handleShift();
    } else if (keyboard.options.layoutName === 'shift' && button !== '{bksp}' && button !== '{space}') {
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




/**
 * Initializes and starts the quiz by setting the current question to 0,
 * displaying the quiz section, hiding the start button, shuffling the questions,
 * and showing the first question.
 */
function startQuiz() {
    currentQuestion = 0;
    const quizSection = document.getElementById('quiz-section');
    quizSection.style.display = 'block'; // display the quiz section
    document.getElementById('start-btn').style.display ='none';  // remove start quiz button 
    shuffleQuestions();
    showQuestion();

}

/**
 * Displays the current quiz question and its possible answers on the webpage.
 * 
 * This function retrieves the current question from the `quizQuestions` object
 * and updates the DOM to show the question and its corresponding answer buttons.
 * It also hides the feedback section and the next button until an answer is selected.
 * Additionally, it sends a request to the server to generate text-to-speech (TTS) for the question.
 * 
 * @throws Will log an error to the console if the TTS request fails.
 */
function showQuestion() {
    const avgQuestionTime = 5000; // 5 seconds
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
    if (!isTalking) {
        // Add TTS for question
        isTalking = true;
        audioEndTime = Date.now() + avgQuestionTime;
        fetch('/quiz-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question.question
            })
        })
        .catch(error => {
            console.error('TTS Error:', error);
            isTalking = false;
        });
    }
}  


/**
 * Checks the selected answer and provides feedback.
 * 
 * @param {number} answerIndex - The index of the selected answer.
 * 
 * This function compares the selected answer with the correct answer for the current question.
 * It disables all answer buttons, displays feedback indicating whether the selected answer is correct or incorrect,
 * and highlights the correct and incorrect answers accordingly. It also displays the next button to proceed to the next question.
 */
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

/**
 * Advances to the next question in the quiz. If there are more questions,
 * it displays the next question. If all questions have been answered,
 * it hides the quiz elements and displays a completion message with an option
 * to play again
 */
function nextQuestion() {
    currentQuestion++;
    if (Date.now() >= audioEndTime) {
        isTalking = false;
        audioEndTime = 0;
    }
    if (currentQuestion < 5) {
        showQuestion();
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
            <button class="btn" id="start-btn" onclick="playAgain()">Play Again?</button>`;
        quizSection.appendChild(completionDiv);

    }
}

/**
 * Resets the quiz to its initial state and starts a new quiz.
 * 
 * This function performs the following actions:
 * 1. Removes the completion message from the quiz section.
 * 2. Resets the quiz questions to their original state.
 * 3. Makes the quiz elements visible again.
 * 4. Resets the current question index to 0.
 * 5. Starts a new quiz.
 */
function playAgain() {
    // Remove completion message
    const quizSection = document.getElementById('quiz-section');
    quizSection.removeChild(quizSection.lastChild);
    // Reset quiz questions to original
    quizQuestions.questions = structuredClone(originalQuestions)
    // Show quiz elements
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('answer-section').style.display = 'grid';
    // Start new quiz
    currentQuestion = 0;
    startQuiz();
}

/**
 * Shuffles the order of questions in the quizQuestions object using the Fisher-Yates algorithm.
 * This function modifies the quizQuestions.questions array in place.
 *
 * @function shuffleQuestions
 */
function shuffleQuestions() {
    for (let i = quizQuestions.questions.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [quizQuestions.questions[i], quizQuestions.questions[random]] = 
        [quizQuestions.questions[random], quizQuestions.questions[i]];
    }
}
