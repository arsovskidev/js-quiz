console.log("Script Loaded.");

let questions = [];
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

showLoading();

fetch(url)
  .then((response) => response.json())
  .then(function (data) {
    questions = data.results;
    hideLoading();
  })
  .catch(function (error) {
    loaderLogs.innerHTML = error;
  });
