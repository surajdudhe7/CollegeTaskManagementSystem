let questions = [];
let users = [];

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    loadUsers();
    displayUserScores();
    displayUsers();

    document.getElementById('logout-top').addEventListener('click', logout);
    document.getElementById('logout-bottom').addEventListener('click', logout);
    document.getElementById('add-question').addEventListener('click', addNewQuestion);
});

function loadQuestions() {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
        questions = JSON.parse(storedQuestions);
    } else {
        fetch('data/questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                saveQuestions();
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                alert('Error loading questions. Please try again.');
            });
    }
    displayQuestions();
}

function displayQuestions() {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'card mb-3';
        questionDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Question ${index + 1}</h5>
                <p class="card-text">${question.question}</p>
                <p><strong>Options:</strong> ${question.options.join(', ')}</p>
                <p><strong>Correct Answer:</strong> ${question.answer}</p>
                <button onclick="editQuestion(${index})" class="btn btn-warning btn-sm me-2">Edit</button>
                <button onclick="deleteQuestion(${index})" class="btn btn-danger btn-sm">Delete</button>
            </div>
        `;
        questionList.appendChild(questionDiv);
    });
}

function addNewQuestion() {
    const question = prompt('Enter the question:');
    const options = prompt('Enter options (comma-separated):');
    const answer = prompt('Enter the correct answer:');

    if (question && options && answer) {
        const optionsArray = options.split(',').map(option => option.trim());
        if (optionsArray.length > 1 && optionsArray.includes(answer)) {
            questions.push({ question, options: optionsArray, answer });
            saveQuestions();
            displayQuestions();
        } else {
            alert('Invalid input. Please ensure you have at least two options and the answer is one of the options.');
        }
    } else {
        alert('Invalid input. Please try again.');
    }
}

function editQuestion(index) {
    const question = prompt('Edit the question:', questions[index].question);
    const options = prompt('Edit options (comma-separated):', questions[index].options.join(','));
    const answer = prompt('Edit the correct answer:', questions[index].answer);

    if (question && options && answer) {
        const optionsArray = options.split(',').map(option => option.trim());
        if (optionsArray.length > 1 && optionsArray.includes(answer)) {
            questions[index] = { question, options: optionsArray, answer };
            saveQuestions();
            displayQuestions();
        } else {
            alert('Invalid input. Please ensure you have at least two options and the answer is one of the options.');
        }
    } else {
        alert('Invalid input. No changes were made.');
    }
}

function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions.splice(index, 1);
        saveQuestions();
        displayQuestions();
    }
}

function saveQuestions() {
    localStorage.setItem('questions', JSON.stringify(questions));
}

function displayUserScores() {
    const userScores = document.getElementById('user-scores');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const scores = users.filter(user => user.role === 'user' && user.score !== undefined)
                        .map(user => `<p>${user.username}: ${user.score}</p>`)
                        .join('');
    userScores.innerHTML = scores || '<p>No scores available.</p>';
}

function loadUsers() {
    users = JSON.parse(localStorage.getItem('users')) || [];
}

function displayUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach((user, index) => {
        if (user.role === 'user') {
            const userDiv = document.createElement('div');
            userDiv.className = 'card mb-3';
            userDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${user.username}</h5>
                    <p class="card-text">User ID: ${index}</p>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="user-toggle-${index}" 
                               ${user.isAllowed ? 'checked' : ''}>
                        <label class="form-check-label" for="user-toggle-${index}">
                            Allow to take test
                        </label>
                    </div>
                </div>
            `;
            userList.appendChild(userDiv);

            document.getElementById(`user-toggle-${index}`).addEventListener('change', (e) => {
                toggleUserAccess(index, e.target.checked);
            });
        }
    });
}

function toggleUserAccess(index, isAllowed) {
    users[index].isAllowed = isAllowed;
    localStorage.setItem('users', JSON.stringify(users));
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
