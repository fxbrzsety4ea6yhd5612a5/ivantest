const questions = [
    {
        question: "Что такое JavaScript?",
        answers: ["Язык программирования", "Компьютерная игра", "Страница в социальной сети"],
        correctAnswer: 0
    },
    {
        question: "Что такое HTML?",
        answers: ["Язык разметки", "Язык программирования", "Браузер"],
        correctAnswer: 0
    }
];

let currentQuestion = 0;
let correctAnswersCount = 0;
let username = "";
let userAnswers = [];

const loginContainer = document.getElementById('login-container');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');

const questionElement = document.querySelector('#question h2');
const answerButtonsElement = document.getElementById('answer-buttons');
const startButton = document.getElementById('start-btn');
const clearDbButton = document.getElementById('clear-db-btn');
const retryButton = document.getElementById('retry-btn');

startButton.addEventListener('click', startQuiz);
clearDbButton.addEventListener('click', clearDatabase);
retryButton.addEventListener('click', retryQuiz);

function startQuiz() {
    username = document.getElementById('username').value.trim();
    if (username) {
        loginContainer.style.display = "none";
        quizContainer.style.display = "block";
        showQuestion();
    } else {
        alert("Пожалуйста, введите ваше имя.");
    }
}

function showQuestion() {
    resetState();
    const current = questions[currentQuestion];
    questionElement.innerText = current.question;

    current.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => checkAnswer(index));
        answerButtonsElement.appendChild(button);
    });
}

function checkAnswer(answerIndex) {
    const current = questions[currentQuestion];
    let isCorrect = (answerIndex === current.correctAnswer);

    if (isCorrect) {
        correctAnswersCount++;
    }

    userAnswers.push({
        question: current.question,
        correctAnswer: current.answers[current.correctAnswer],
        isCorrect: isCorrect
    });

    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function saveResultsToDatabase() {
    let db = JSON.parse(localStorage.getItem('quizResults') || '[]');
    db.push({
        username: username,
        answers: userAnswers
    });
    localStorage.setItem('quizResults', JSON.stringify(db));
}

function finishQuiz() {
    saveResultsToDatabase();
    
    quizContainer.style.display = "none";
    resultsContainer.style.display = "block";

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>${username}, вы ответили правильно на ${correctAnswersCount} из ${questions.length} вопросов.</p>`;

    let db = JSON.parse(localStorage.getItem('quizResults') || '[]');
    db.forEach((entry, userIndex) => {
        const resultPiece = document.createElement('div');
        resultPiece.innerHTML = `<p><strong>Пользователь ${userIndex + 1}: ${entry.username}</strong></p>`;
        entry.answers.forEach((answer, index) => {
            resultPiece.innerHTML += `<p>Вопрос ${index + 1}: ${answer.question} | Правильный ответ: ${answer.correctAnswer} | Правильный: ${answer.isCorrect ? 'Да' : 'Нет'}</p>`;
        });
        resultsDiv.appendChild(resultPiece);
    });
}

function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function clearDatabase() {
    localStorage.removeItem('quizResults');
    alert("База данных очищена.");
    resultsContainer.style.display = "none";
    loginContainer.style.display = "block";
    currentQuestion = 0;
    correctAnswersCount = 0;
    userAnswers = [];
}

function retryQuiz() {
    currentQuestion = 0;
    correctAnswersCount = 0;
    userAnswers = [];
    resultsContainer.style.display = "none";
    quizContainer.style.display = "block";
    showQuestion();
}