console.log("Quiz Loaded.");

// Section for loading & configuration.
const loadingSection = document.querySelector("#loading");
const beginSection = document.querySelector("#begin");
const inActionSection = document.querySelector("#inAction");
const resultsSection = document.querySelector("#results");

const loaderLogs = document.querySelector("#loaderLogs");

const url = "https://opentdb.com/api.php?amount=20";
const cache = window.sessionStorage;

function startLoading() {
  // Show
  loadingSection.classList.remove("d-none");
  // Hide
  beginSection.classList.add("d-none");
  inActionSection.classList.add("d-none");

  // Section for api call.
  cache.clear();
  window.location.hash = "";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (i = 0; i < data.results.length; i++) {
        // Adding 1 every time to {i} because we need the questions to start from 1, not from 0. 🤟
        cache.setItem(`question-${i + 1}`, JSON.stringify(data.results[i]));
      }
      endLoading();
    })
    .catch(function (error) {
      loaderLogs.innerHTML = error;
    });
}
function endLoading() {
  // Animation
  loadingSection.classList.add("animate__animated", "animate__backOutDown");
  setTimeout(function () {
    // Hide
    loadingSection.classList.add("d-none");
    // Show
    beginSection.classList.remove("d-none");
    beginSection.classList.add("animate__animated", "animate__backInDown");
  }, 500);
}

// Section for starting.
const startBtn = document.querySelector("#startBtn");

startBtn.addEventListener("click", function (e) {
  cache.setItem("correct_points", 0);
  window.location.hash = "question-1";

  // Animation
  beginSection.classList.add("animate__animated", "animate__backOutUp");
  setTimeout(function () {
    // Hide
    beginSection.classList.add("d-none");
    // Show
    inActionSection.classList.remove("d-none");
    inActionSection.classList.add("animate__animated", "animate__backInUp");
  }, 500);
});

// Section for resetting.
const resetBtn = document.querySelectorAll("#resetBtn");

resetBtn.forEach(function (button) {
  button.addEventListener("click", function (e) {
    window.location.reload();
  });
});

// Section for questions processing.
window.addEventListener("hashchange", function (e) {
  if (window.location.hash) {
    let hash = location.hash.split("#")[1];
    renderQuestion(hash);
  }
});

// Section for rendering the question corresponding to the given hash.
function renderQuestion(hash) {
  let currentQuestionInt = parseInt(hash.split("question-")[1]);
  if (currentQuestionInt >= 1 && currentQuestionInt <= 20) {
    setTimeout(function () {
      let questionContainer = document.querySelector("#questionContainer");
      let question = JSON.parse(cache.getItem(hash));
      let questionTitle = document.querySelector("#questionTitle");
      let category = document.querySelector("#category");
      let answersWrapper = document.querySelector("#answersWrapper");

      // Animation
      questionContainer.classList.remove("animate__lightSpeedOutRight");
      questionContainer.classList.add("animate__lightSpeedInLeft");

      questionTitle.innerHTML = question.question;
      category.innerHTML = question.category;
      answersWrapper.innerHTML = "";

      renderCompletedCounter();

      let answersArray = [];

      for (i = 0; i < question.incorrect_answers.length; i++) {
        let node = document.createElement("a");
        node.classList.add("btn", "btn-outline-dark");
        node.innerText = question.incorrect_answers[i];
        node.setAttribute(
          "onclick",
          `validateAnswer("` + question.incorrect_answers[i] + `");`
        );
        answersArray.push(node);
      }
      let node = document.createElement("a");
      node.classList.add("btn", "btn-outline-dark");
      node.innerText = question.correct_answer;
      node.setAttribute(
        "onclick",
        `validateAnswer("` + question.correct_answer + `");`
      );
      answersArray.push(node);
      // Shuffling the order for the buttons, because we dont want to have the correct answer to be the last object every time.
      answersArray = answersArray.sort(() => Math.random() - 0.5);
      answersArray.forEach(function (node) {
        answersWrapper.appendChild(node);
      });
    }, 1000);
  } else {
    renderResults();
  }
}

// For validating if the answer is the same as in the object (question.correct_answer).
function validateAnswer(answer) {
  // Animation
  let questionContainer = document.querySelector("#questionContainer");
  questionContainer.classList.remove("animate__lightSpeedInLeft");
  questionContainer.classList.add("animate__lightSpeedOutRight");

  let hash = location.hash.split("#")[1];
  let question = JSON.parse(cache.getItem(hash));
  let currentQuestionInt = parseInt(location.hash.split("question-")[1]);
  currentQuestionInt++;
  let nextHash = `#question-${currentQuestionInt}`;

  if (question.correct_answer === answer) {
    // If the answer is correct.
    let oldPoints = parseInt(cache.getItem("correct_points"));
    oldPoints++;
    cache.setItem("correct_points", oldPoints);
  } else {
    // If the answer is not correct.
  }

  window.location.hash = nextHash;
}

// For rendering the completed questions counter in the inAction section.
function renderCompletedCounter() {
  let container = document.querySelector("#questionsCompleted");
  let currentQuestion = parseInt(location.hash.split("question-")[1]);
  let questionsCompleted = currentQuestion - 1;
  container.innerText = questionsCompleted;
}

// For rendering the correct questions counter in the results section.
function renderResults() {
  window.location.hash = "results";

  let container = document.querySelector("#questionsCorrect");
  let correctQuestions = parseInt(cache.getItem("correct_points"));
  container.innerText = correctQuestions;

  // Animation
  inActionSection.classList.add("animate__animated", "animate__backOutUp");
  setTimeout(function () {
    // Hide
    inActionSection.classList.add("d-none");
    // Show
    resultsSection.classList.remove("d-none");
    resultsSection.classList.add("animate__animated", "animate__heartBeat");

    cache.setItem("correct_points", 0);
  }, 1000);
}

startLoading();
