// Global variables
var myAPIKey = '79ccccbf056ad9d002777e1e5b09a098';
var city;
var date = dayjs().format('MM/DD/YYYY');

// DOM element references
var cityInputEl = document.getElementById('city-input');
var todaysWeatherEl = document.getElementById('todays-weather');
var weeklyHeaderEl = document.getElementById('weekly-header');
var forecastEl = document.getElementById('weekly-forecast');
var searchHistoryEl = document.getElementById('search-history');
var searchBtnEl = document.getElementById('search-btn')
var cityNameDateEl = document.getElementById('city-name-date')
var tempEl =  document.getElementById('temperature');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var iconEl = document.getElementById('weather-icon');

// Function to display the search history list.
function renderSearchHistory() {
  // empty the search history container
  searchHistoryEl.innerHTML = "";
  // loop through the history array creating a button for each item
  for (var i = 0; i < localStorage.length; i++) {
    var cityBtn = document.createElement("button");
    cityBtn.textContent = localStorage.getItem(localStorage.key(i));
    cityBtn.setAttribute("class", "form-control mt-3");
    // append to the search history container
    searchHistoryEl.append(cityBtn);
    // click event to run the handleSearchHistoryClick
    cityBtn.addEventListener("click", handleSearchHistoryClick);
  }
}
  
// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // sets searched city to searched city in local storage
  localStorage.setItem(search, search);

  // calls renderSearchHistory function
  renderSearchHistory();
}

// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  todaysWeatherEl.classList.remove('d-none')
  // Store response data from our fetch request in variables
  // temperature, wind speed, etc.
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humidity = weather.main.humidity;
  var icon = weather.weather[0].main;
  if (icon == "Clear") {
    icon = '<i class="fa-solid fa-sun"></i>';
  } else if (icon == "Clouds") {
    icon = '<i class="fa-solid fa-cloud"></i>';
  } else if (icon == "Rain") {
    icon = '<i class="fa-solid fa-cloud-rain"></i>';
  } else {
    return;
  }
  
  // element content
  cityNameDateEl.textContent = city + " " + date;
  iconEl.innerHTML = icon;
  tempEl.textContent = "Temp: " + temp + "°C";
  windEl.textContent = "Wind: " + wind + "kph";
  humidityEl.textContent = "Humidity: " + humidity + "%";
}
  
// Function to display 5 day forecast.
function renderForecast(hourlyForecast) {
  forecastEl.innerHTML = "";
  weeklyHeaderEl.classList.remove('d-none');
  // grabs data for noon of each date the cards display, (5 days after the current weather)
  var dailyForecast = hourlyForecast.filter(hour => hour.dt_txt.includes("12:00:00"))
  
  // loop over dailyForecast
  for (var i = 0; i < 5; i++) { 
    var temp = dailyForecast[i].main.temp;
    var wind = dailyForecast[i].wind.speed;
    var humidity = dailyForecast[i].main.humidity;
    var icon = dailyForecast[i].weather[0].main; 
    if (icon == "Clear") {
      icon = '<i class="fa-solid fa-sun"></i>';
    } else if (icon == "Clouds") {
      icon = '<i class="fa-solid fa-cloud"></i>';
    } else if (icon == "Rain") {
      icon = '<i class="fa-solid fa-cloud-rain"></i>';
    } else {
      return;
    }

    // creates elements for the forecast cards
    var forecastCardEl = document.createElement('div');
    forecastCardEl.setAttribute("class", "col-md-2 card m-3");
    var dateCardEl = document.createElement('h5');
    var iconCardEl = document.createElement('p');
    var tempCardEl = document.createElement('p');
    var speedCardEl = document.createElement('p');
    var humidityCardEl = document.createElement('p');

    // appends created elements
    forecastEl.append(forecastCardEl);
    forecastCardEl.append(dateCardEl);
    forecastCardEl.append(iconCardEl);
    forecastCardEl.append(tempCardEl);
    forecastCardEl.append(speedCardEl);
    forecastCardEl.append(humidityCardEl);

    // gives created elements content
    dateCardEl.textContent = dayjs().add(i+1, "day").format("MM/DD/YYYY");
    iconCardEl.innerHTML = icon;
    tempCardEl.textContent = "Temp: " + temp + "°C";
    speedCardEl.textContent = "Wind: " + wind + "kph";
    humidityCardEl.textContent = "Humidity: " + humidity + "%";
  }
}
  
// fetches weather data from api
function fetchWeather(city) {
  
  // api url
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myAPIKey}`
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${myAPIKey}`;
  
  // fetch, using the api url, .then that returns the response as json, .then that calls renderCurrentWeather
  fetch(weatherUrl)
  .then(response => response.json())
  .then(data => {
    renderCurrentWeather(city, data);
  });

  // fetch, using the api url, .then that returns the response as json, .then that calls renderForecast
  fetch(forecastUrl)
  .then(response => response.json())
  .then(data => {
    renderForecast(data.list);
    
  });

  // calls appendToHistory function
  appendToHistory(city);
}
  
function handleSearchFormSubmit(e) {
  e.preventDefault();
  // Don't continue if there is nothing in the search form
  if (!cityInputEl.value) {
    alert("Enter a city name to display weather")
    return;
  }
  
  // sets search equal to user unput value and sends over data to fetchweather function
  var search = cityInputEl.value;
  fetchWeather(search);
  // empties user input value for next input
  cityInputEl.value = "";
}
  
function handleSearchHistoryClick(e) {
  // set search equal to text of the button clicked
  search = e.target.textContent;
  // pass over the saerch to fetchWeather function
  fetchWeather(search);
}

//init previous search buttons on reload
renderSearchHistory();

// click event to run the handleFormSubmit
searchBtnEl.addEventListener("click", handleSearchFormSubmit);