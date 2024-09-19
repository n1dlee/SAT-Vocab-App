let currentQuestion = "";
let currentOptions = [];
let correctAnswer = "";
let correctCount = 0;
let totalCount = 0;
let currentMode = "word_to_definition";
let answerSubmitted = false;

function setTheme(themeName) {
  document.body.className = themeName;
  localStorage.setItem("theme", themeName);
}

function loadTheme() {
  const theme = localStorage.getItem("theme") || "light-theme";
  setTheme(theme);
}

async function loadQuestion() {
  answerSubmitted = false;
  if (correctCount >= 10) {
    alert(
      "Congratulations! You answered 10 questions correctly. The application will now close.."
    );
    window.close();
    return;
  }

  const data = await eel.get_question(currentMode)();

  const questionElement = document.getElementById("question");
  const optionsDiv = document.getElementById("options");
  const inputAnswer = document.getElementById("input-answer");

  optionsDiv.innerHTML = "";
  inputAnswer.style.display = "none";
  inputAnswer.value = "";

  if (currentMode === "word_to_definition") {
    currentQuestion = data.word;
    currentOptions = data.options;
    questionElement.textContent = `What definition matches the word "${data.word}"?`;
    data.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => checkAnswer(option));
      optionsDiv.appendChild(button);
    });
  } else if (currentMode === "definition_to_word") {
    currentQuestion = data.definition;
    currentOptions = data.options;
    questionElement.textContent = `Which word matches the definition: "${data.definition}"?`;
    data.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => checkAnswer(option));
      optionsDiv.appendChild(button);
    });
  } else {
    // definition_to_input
    currentQuestion = data.word;
    correctAnswer = data.word;
    questionElement.textContent = `Enter a word that matches the definition: "${data.definition}"`;
    inputAnswer.style.display = "block";
  }

  document.getElementById("result").textContent = "";
  document.getElementById("next-button").style.display = "none";
}

async function checkAnswer(selectedAnswer) {
  if (answerSubmitted) return;
  answerSubmitted = true;

  totalCount++;
  let isCorrect;

  if (currentMode === "definition_to_input") {
    const inputAnswer = document.getElementById("input-answer").value;
    isCorrect = await eel.check_answer(
      currentMode,
      correctAnswer,
      inputAnswer
    )();
  } else {
    isCorrect = await eel.check_answer(
      currentMode,
      currentQuestion,
      selectedAnswer
    )();
  }

  const resultElement = document.getElementById("result");
  if (isCorrect) {
    correctCount++;
    resultElement.textContent = "Correct!";
    resultElement.style.color = "green";
  } else {
    resultElement.textContent = `Incorrect. Correct answer is: ${
      currentMode === "word_to_definition" ? currentOptions[0] : correctAnswer
    }`;
    resultElement.style.color = "red";
  }

  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("total-count").textContent = totalCount;
  document.getElementById("next-button").style.display = "block";

  if (currentMode !== "definition_to_input") {
    const optionButtons = document.querySelectorAll("#options button");
    optionButtons.forEach((button) => {
      button.disabled = true;
      if (
        button.textContent ===
        (currentMode === "word_to_definition"
          ? currentOptions[0]
          : correctAnswer)
      ) {
        button.style.backgroundColor = "green";
      } else if (button.textContent === selectedAnswer) {
        button.style.backgroundColor = "red";
      }
    });
  }

  if (correctCount >= 10) {
    document.getElementById("next-button").textContent = "Завершить";
  }
}

function setMode(mode) {
  currentMode = mode;
  loadQuestion();
}

document.getElementById("next-button").addEventListener("click", loadQuestion);

document
  .getElementById("input-answer")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter" && !answerSubmitted) {
      checkAnswer(this.value);
    }
  });

window.onload = function () {
  loadTheme();
  loadQuestion();
};

window.onbeforeunload = function () {
  return correctCount >= 10
    ? null
    : "You cannot close the window until you answer 10 questions correctly.";
};
