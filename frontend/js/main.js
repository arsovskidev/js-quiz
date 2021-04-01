console.log("Script Loaded.");

let fetched = [];
// Section for loading.
const loader = document.querySelector("#loading");
const loaderLogs = document.querySelector("#loaderLogs");

function showLoading() {
  loader.classList.remove("d-none");
}
function hideLoading() {
  loader.classList.add("d-none");
}

// Section for api call.
const url = "https://opentdb.com/api.php?amount=20";

showLoading();

fetch(url)
  .then((response) => response.json())
  .then(function (data) {
    let questions = data.results;
    fetched.push(questions);
    hideLoading();
  })
  .catch(function (error) {
    loaderLogs.innerHTML = error;
  });
