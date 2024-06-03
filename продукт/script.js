const questions = [
    // Существующие вопросы
    {
        question: "Что такое JavaScript?",
        answers: ["Язык программирования", "Компьютерная игра", "Страница в социальной сети"],
        correctAnswer: 0
    },
    {
        question: "Что такое HTML?",
        answers: ["Язык разметки", "Язык программирования", "Браузер"],
        correctAnswer: 0
    },
    // Новые вопросы
    {
        question: "Какой тег HTML используется для создания гиперссылок?",
        answers: ["<link>", "<a>", "<href>"],
        correctAnswer: 1
    },
    {
        question: "Какой объект JavaScript используется для работы с датами?",
        answers: ["String", "Date", "Time"],
        correctAnswer: 1
    },
    {
        question: "Что означает CSS?",
        answers: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets"],
        correctAnswer: 2
    },
    {
        question: "Какой атрибут HTML определяет видимый текст кнопки?",
        answers: ["text", "value", "label"],
        correctAnswer: 1
    },
    {
        question: "Какая функция JavaScript создает цикл, который выполняется, пока условие истинно?",
        answers: ["for", "while", "loop"],
        correctAnswer: 1
    },
    {
        question: "Какой HTML тег используется для вставки изображения?",
        answers: ["<img>", "<image>", "<picture>"],
        correctAnswer: 0
    },
    {
        question: "Какой CSS свойство используется для изменения цвета текста?",
        answers: ["font-color", "text-color", "color"],
        correctAnswer: 2
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
        answers: userAnswers,
        score: correctAnswersCount
    });
    localStorage.setItem('quizResults', JSON.stringify(db));
}

function finishQuiz() {
    saveResultsToDatabase();
    
    quizContainer.style.display = "none";
    resultsContainer.style.display = "block";

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>' + username + ', вы ответили правильно на ' + correctAnswersCount + ' из ' + questions.length + ' вопросов.</p>';

    let db = JSON.parse(localStorage.getItem('quizResults') || '[]');
    db.forEach((entry, userIndex) => {
        const resultPiece = document.createElement('div');
        resultPiece.innerHTML = '<p><strong>Пользователь ' + (userIndex + 1) + ': ' + entry.username + '</strong></p>';
        entry.answers.forEach((answer, index) => {
            resultPiece.innerHTML += '<p>Вопрос ' + (index + 1) + ': ' + answer.question + ' | Правильный ответ: ' + answer.correctAnswer + ' | Правильный: ' + (answer.isCorrect ? 'Да' : 'Нет') + '</p>';
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
    resetQuizState();
    showQuestion();
}

function resetQuizState() {
    currentQuestion = 0;
    correctAnswersCount = 0;
    userAnswers = [];
    resultsContainer.style.display = "none";
    quizContainer.style.display = "block";
    resetState();
}