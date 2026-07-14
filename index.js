// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
function isValidState(state) {
  return typeof state === "string" && /^[A-Za-z]{2}$/.test(state.trim());
}

async function fetchWeatherAlerts(state) {
  if (!isValidState(state)) {
    displayError("Please enter a valid two-letter state abbreviation (e.g. CA, TX, NY).");
    return null;
  }

  const STATE_ABBR = state.trim().toUpperCase();
  const alertsDisplay = document.getElementById("alerts-display");

  if (alertsDisplay) {
    alertsDisplay.innerHTML = '<p class="loading">Loading alerts...</p>';
  }

  try {
    const response = await fetch(`${weatherApi}${STATE_ABBR}`);

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.detail) message = errorBody.detail;
      } catch (_) {
        // response body wasn't JSON - fall back to default message
      }
      throw new Error(message);
    }

    const data = await response.json();
    console.log(data);

    displayAlerts(data);
    return data;
  } catch (errorObject) {
    console.log(errorObject.message);
    displayError(errorObject.message);
    return null;
  }
}

function displayAlerts(data) {
  const alertsDisplay = document.getElementById("alerts-display");
  const errorDiv = document.getElementById("error-message");
  if (!alertsDisplay) return;

  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");
  }

  alertsDisplay.innerHTML = "";

  const features = Array.isArray(data.features) ? data.features : [];
  const title = data.title || "Weather Alerts";

  const summary = document.createElement("p");
  summary.className = "summary";
  summary.textContent = `${title}: ${features.length}`;
  alertsDisplay.appendChild(summary);

  if (features.length === 0) return;

  const list = document.createElement("ul");
  features.forEach((feature) => {
    const li = document.createElement("li");
    const props = feature.properties || {};
    li.textContent = props.headline || "Weather Alert";
    list.appendChild(li);
  });
  alertsDisplay.appendChild(list);
}

function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  const alertsDisplay = document.getElementById("alerts-display");

  if (alertsDisplay) alertsDisplay.innerHTML = "";
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
  }
}

function initApp() {
  const button = document.getElementById("fetch-alerts");
  const input = document.getElementById("state-input");

  if (!button || !input) return;

  const handleSearch = () => {
    const state = input.value;
    input.value = "";

    if (!state || state.trim() === "") {
      displayError("Please enter a state abbreviation.");
      return;
    }
    fetchWeatherAlerts(state);
  };

  button.addEventListener("click", handleSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

if (typeof document !== "undefined") {
  initApp();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    displayError,
    isValidState,
    initApp,
    weatherApi,
  };
}





 
