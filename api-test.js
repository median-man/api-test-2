var requestFormEl = document.querySelector("#req-form");
var statusEl = document.querySelector("#status");
var headersEl = document.querySelector("#headers");
var bodyEl = document.querySelector("#body");
var urlInput = document.querySelector("#url-input");
var reqUrlEl = document.querySelector("#req-url");
var isPending = false;

function renderStatus(text) {
  statusEl.textContent = text;
}

function renderRequestedUrl(url) {}

function renderResponseHeaders(response) {
  let headers = "";
  for (var pair of response.headers.entries()) {
    headers += pair[0] + ": " + pair[0] + "\n";
  }
  headersEl.textContent = headers;
}

function renderJson(data) {
  bodyEl.textContent = JSON.stringify(data, null, 4);
}

function handleRequestForm(event) {
  event.preventDefault();
  if (isPending) {
    return;
  }
  isPending = true;
  var url = new URL(urlInput.value.trim());
  if (!url) {
    return;
  }
  renderStatus("fetching...");
  fetch(url)
    .then(function (response) {
      renderStatus(response.status);
      renderResponseHeaders(response);
      return response.json();
    })
    .then(function (data) {
      renderJson(data);
    })
    .catch(function (error) {
      console.log(error);
      renderJson(error);
    })
    .finally(function () {
      isPending = false;
    });
}

requestFormEl.addEventListener("submit", handleRequestForm);
