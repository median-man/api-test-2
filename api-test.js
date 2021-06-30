var requestFormEl = document.querySelector("#req-form");
var statusEl = document.querySelector("#status");
var headersEl = document.querySelector("#headers");
var bodyEl = document.querySelector("#body");
var urlInput = document.querySelector("#url-input");
var labelInput = document.querySelector("#req-label");
var reqUrlEl = document.querySelector("#req-url");
var historyEl = document.querySelector("#history");
var clearHistoryButton = document.querySelector("#clear-history");
var requestHistory = [];
var isPending = false;

function renderHistory() {
  historyEl.innerHTML = "";
  for (var i = 0; i < requestHistory.length; i += 1) {
    var url = requestHistory[i].url;
    var label = requestHistory[i].label;
    var button = document.createElement("button");
    button.setAttribute(
      "class",
      "list-group-item list-group-item-action history-item"
    );
    button.dataset.url = url;
    button.textContent = label;
    historyEl.prepend(button);
  }
}

function clearHistory() {
  requestHistory.length = 0;
  localStorage.removeItem("history");
  renderHistory();
}

/**
 * Updates history in localStorage and renders history.
 *
 * Searches history for item with same url, updates the label, and moves it to
 * the end of history. If no matching url found in history, adds item to the
 * end. Maximum history length is 25 items. Removes first item from history if
 * max length is exceeded.
 *
 * @param {string} url Request url
 * @param {string} [label] Label for the request
 *
 */
function saveRequestHistory(url, label) {
  var MAX_ITEMS = 25;
  var historyItemIdx = -1;
  var historyItem;
  for (var i = 0; i < requestHistory.length && historyItemIdx === -1; i += 1) {
    if (requestHistory[i].url === url && requestHistory[i].label === label) {
      historyItemIdx = i;
    }
  }
  if (historyItemIdx === -1) {
    historyItem = { url: url, label: label };
  } else {
    // move match to the end of history
    historyItem = requestHistory.splice(historyItemIdx, 1)[0];
  }
  requestHistory.push(historyItem);
  if (requestHistory.length > MAX_ITEMS) {
    requestHistory.shift();
  }
  localStorage.setItem("history", JSON.stringify(requestHistory));
  renderHistory();
}

function initHistory() {
  var storedHistory = localStorage.getItem("history");
  if (!storedHistory) {
    return;
  }
  requestHistory = JSON.parse(storedHistory);
  renderHistory();
}

function renderStatus(text) {
  statusEl.textContent = text;
}

function renderRequestedUrl(url) {
  reqUrlEl.textContent = url;
}

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

function sendRequest(url, options) {
  var label = options.label;
  if (isPending) {
    return;
  }
  isPending = true;

  renderRequestedUrl(url);
  renderStatus("fetching...");
  return fetch(url)
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

function handleRequestForm(event) {
  event.preventDefault();
  var url = new URL(urlInput.value.trim());
  var label = labelInput.value.trim();
  if (!url) {
    return;
  }
  sendRequest(url, { label: label }).then(function () {
    if (label) {
      saveRequestHistory(url.toString(), label);
    }
  });
}

function handleHistoryClick(event) {
  var historyItemEl = event.target.closest(".history-item");
  if (historyItemEl === null) {
    return;
  }
  var url = historyItemEl.dataset.url;
  var label = historyItemEl.textContent;
  sendRequest(url, { label: label });
  labelInput.value = label;
  urlInput.value = url;
  saveRequestHistory(url, label);
}

initHistory();

requestFormEl.addEventListener("submit", handleRequestForm);
historyEl.addEventListener("click", handleHistoryClick);
clearHistoryButton.addEventListener("click", clearHistory);
