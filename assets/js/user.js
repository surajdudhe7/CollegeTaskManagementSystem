let questions = [];
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const startQuizButton = document.getElementById('start-quiz');
    if (startQuizButton) {
        startQuizButton.addEventListener('click', startQuiz);
    }

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        loadQuestions();
    }

    const shareScoreButton = document.getElementById('share-score');
    if (shareScoreButton) {
        shareScoreButton.addEventListener('click', shareScore);
    }

    const returnMainButton = document.getElementById('return-main');
    if (returnMainButton) {
        returnMainButton.addEventListener('click', () => window.location.href = 'main.html');
    }
});

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

function startQuiz() {
    const questionCount = document.getElementById('question-count').value;
    localStorage.setItem('questionCount', questionCount);
    window.location.href = 'quiz.html';
}

let currentQuestionIndex = 0;
// let totalQuestions = 5;

function loadQuestions() {
    const questionsData = localStorage.getItem('questions');
    if (questionsData) {
        const questions = JSON.parse(questionsData); // Parse questions
        totalQuestions = Math.min(questions.length, parseInt(localStorage.getItem('questionCount')) || 5);
        const shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions); // Shuffle and slice
        displayQuestion(shuffledQuestions[currentQuestionIndex], shuffledQuestions); // Display the first question
    } else {
        console.error('No questions found in localStorage.');
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestion(question, questions) {
    if (!question) {
        showResult(); // No more questions, show results
        return;
    }

    console.log("Displaying question:", question.question);

    // Set the question text
    document.getElementById('question').textContent = question.question;

    // Clear previous options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    // Render the options
    question.options.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'btn btn-outline-primary w-100 mb-2';
        button.onclick = () => {
            checkAnswer(option, question.answer, questions); // Pass data to checkAnswer
        };
        console.log("Option:", option);
        optionsContainer.appendChild(button); // Add to the DOM
    });

    // Update the status
    document.getElementById('status').textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
}

function checkAnswer(selectedOption, correctAnswer, questions) {
    if (selectedOption === correctAnswer) {
        console.log('Correct!');
        score++;
    } else {
        console.log('Incorrect!');
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        displayQuestion(questions[currentQuestionIndex], questions); // Display next question
    } else {
        showResult(); // All questions completed
    }
}

function showResult() {
    // Hide the quiz container and show the result container
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';

    // Display the user's score
    document.getElementById('score').textContent = `${score} out of ${totalQuestions}`;

    // Update and save the current user's score
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.score = score; // Update score in current user object
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save to localStorage

        // Update the score in the users array in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex !== -1) {
            users[userIndex].score = score; // Update the user's score
            localStorage.setItem('users', JSON.stringify(users)); // Save the updated users array
        } else {
            console.warn('User not found in the users list.');
        }
    } else {
        console.warn('No current user found in localStorage.');
    }
}

function shareScore() {
    // Retrieve the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = currentUser ? currentUser.username : 'Anonymous';

    // Build the shareable URL
    const shareUrl = `${window.location.origin}/share-score.html?score=${score}&total=${totalQuestions}&username=${encodeURIComponent(username)}`;

    // Create a temporary input element to copy the URL to the clipboard
    const tempInput = document.createElement('input');
    tempInput.value = shareUrl;
    document.body.appendChild(tempInput);
    tempInput.select();

    // Copy the URL to the clipboard
    const successfulCopy = document.execCommand('copy');
    document.body.removeChild(tempInput);

    // Notify the user whether the operation was successful
    if (successfulCopy) {
        alert('Share link copied to clipboard! You can now paste and share it.');
    } else {
        console.error('Failed to copy the share link to the clipboard.');
        alert('Failed to copy the share link. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

