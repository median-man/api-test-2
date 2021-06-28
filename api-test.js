var fetchBtn = document.querySelector("#fetch-btn");
var statusEl = document.querySelector("#status");
var headersEl = document.querySelector("#headers");
var bodyEl = document.querySelector("#body");

function fetchMovieData(movieTitle) {
  var apiKey = "apikey=aeb40d80";
  var url = new URL("https://www.omdbapi.com");
  url.search = [apiKey, "t=" + movieTitle].join("&");
  statusEl.textContent = "fetching ...";
  fetch(url)
    .then(function (response) {
      console.log(response);
      statusEl.textContent = response.status;
      let headers = "";
      for (var pair of response.headers.entries()) {
        headers += pair[0] + ": " + pair[0] + "\n";
      }
      headersEl.textContent = headers;
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      bodyEl.textContent = JSON.stringify(data, null, 4);
    });
}

fetchBtn.addEventListener("click", function () {
  fetchMovieData("The Matrix");
});
