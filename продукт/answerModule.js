import { questions, currentQuestion } from './questionModule.js';
import { showQuestion, questionElement, submitButton } from './script.js';

export function checkAnswer(answerIndex) {
  if (answerIndex === questions[currentQuestion].correctAnswer) {
    alert('Правильно!');
  } else {
    alert('Неправильно. Попробуйте еще раз.');
  }
  currentQuestion++;
  
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    questionElement.innerHTML = "<h2>Тест завершен. Спасибо за участие!</h2>";
    submitButton.style.display = "none";
  }
}
  