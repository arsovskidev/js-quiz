console.log("Script Loaded.");

// Section for loading.
const loadingSection = document.querySelector("#loading");
const beginSection = document.querySelector("#begin");
const inActionSection = document.querySelector("#inAction");

const loaderLogs = document.querySelector("#loaderLogs");

function showLoading() {
  // Show
  loadingSection.classList.remove("d-none");
  // Hide
  beginSection.classList.add("d-none");
  inActionSection.classList.add("d-none");
}
function hideLoading() {
  // Hide
  loadingSection.classList.add("d-none");
  // Show
  beginSection.classList.remove("d-none");
}

// Section for api call.
const url = "https://opentdb.com/api.php?amount=20";
const cache = window.localStorage;
cache.clear();
window.location.hash = "";

showLoading();

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    for (i = 0; i < data.results.length; i++) {
      // Adding 1 every time to {i} because we want the questions to start from 1, not from 0. 🤟
      cache.setItem(`question-${i + 1}`, JSON.stringify(data.results[i]));
    }
    hideLoading();
  })
  .catch(function (error) {
    loaderLogs.innerHTML = error;
  });

// Section starting.
const startBtn = document.querySelector("#startBtn");
startBtn.addEventListener("click", function (e) {
  // Hide
  beginSection.classList.add("d-none");
  // Show
  inActionSection.classList.remove("d-none");

  cache.setItem("correct_points", 0);

  window.location.hash = "question-1";
});

// Section resetting.
const resetBtn = document.querySelector("#resetBtn");

resetBtn.addEventListener("click", function (e) {
  window.location.reload();
});

// Section for questions processing.
window.addEventListener("hashchange", function (e) {
  if (window.location.hash) {
    let hash = location.hash.split("#")[1];
    renderQuestion(hash);
  }
});

function renderQuestion(data) {
  let question = JSON.parse(cache.getItem(data));
  let questionTitle = document.querySelector("#questionTitle");
  let category = document.querySelector("#category");
  let answersWrapper = document.querySelector("#answersWrapper");

  questionTitle.innerHTML = question.question;
  category.innerHTML = question.category;
  answersWrapper.innerHTML = "";

  renderCompletedStatus();
  //TODO make randomizing order of answer buttons.

  for (i = 0; i < question.incorrect_answers.length; i++) {
    let aTag = document.createElement("a");
    aTag.classList.add("btn", "btn-outline-dark");
    aTag.innerText = question.incorrect_answers[i];
    answersWrapper.appendChild(aTag);
  }
  let aTag = document.createElement("a");
  aTag.classList.add("btn", "btn-outline-dark");
  aTag.innerText = question.correct_answer;
  answersWrapper.appendChild(aTag);
}

function validateAnswer(answer) {
  if (window.location.hash) {
    let hash = location.hash.split("#")[1];
    let question = JSON.parse(cache.getItem(hash));
    let currentQuestion = parseInt(location.hash.split("question-")[1]);
    let nextHash = `#question-${currentQuestion + 1}`;
    window.location.hash = nextHash;
    console.log(hash);
    console.log(question);
    console.log(nextHash);
    if (question.correct_answer === answer) {
      console.log("CORRECT!");
      let oldPoints = parseInt(cache.getItem("correct_points"));
      cache.setItem("correct_points", oldPoints + 1);
    } else {
      console.log("INCORRECT!");
    }
  } else {
    console.log("ERR: There is no hash.");
  }
}

function renderCompletedStatus() {
  let container = document.querySelector("#questionsCompleted");
  let currentQuestion = parseInt(location.hash.split("question-")[1]);
  let questionsCompleted = currentQuestion;
  container.innerText = questionsCompleted;
}

// Section for helpful functions.

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
