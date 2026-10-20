const weatherApi = "https://api.weather.gov/alerts/active?area="

const input = document.getElementById('state-input');
const button = document.getElementById('fetch-alerts');
const display = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');
const loading = document.getElementById('loading');

function displayAlerts(data) {
  display.innerHTML = ''; 
  const summary = document.createElement('p');
  summary.textContent = `${data.title}: ${data.features.length}`;
  display.appendChild(summary);

  const ul = document.createElement('ul');
  data.features.forEach((alert) => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });
  display.appendChild(ul);
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden'); 
}

function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden'); 
}

async function fetchWeatherAlerts(state) {
  loading.classList.remove('hidden'); 
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?area=${state}`
    );
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const data = await response.json();
    console.log(data);
    clearError();           
    displayAlerts(data);
  } catch (error) {
    console.log(error.message);
    display.innerHTML = '';
    showError(error.message);
  } finally {
    loading.classList.add('hidden'); 
  }
}

button.addEventListener('click', () => {
  const state = input.value.trim().toUpperCase();
  input.value = ''; 

  if (!/^[A-Z]{2}$/.test(state)) {
    showError('Please enter a two-letter state code, like MN.');
    return;
  }
  fetchWeatherAlerts(state);
});

