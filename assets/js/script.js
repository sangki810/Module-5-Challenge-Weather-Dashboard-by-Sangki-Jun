// Global variables
var myAPIKey = '79ccccbf056ad9d002777e1e5b09a098';
var city;
var searchHistoryArr = [];
var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${myAPIKey}`;

// DOM element references
var cityInputEl = document.getElementById('city-input');
var todaysWeatherEl = document.getElementById('todays-weather');
var forecastEl = document.getElementById('weekly-forecast');
var searchHistoryEl = document.getElementById('search-history');
var searchBtnEl = document.getElementById('search-btn')

var tempEl =  document.getElementById('temperature');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var cloudEl = document.getElementById('weather-icon');

// Function to display the search history list.
function renderSearchHistory() {
  // empty the search history container
  searchHistoryEl.innerHTML = "";
  // loop through the history array creating a button for each item
  for (var i = 0; i < localStorage.length; i++) {
    var cityBtn = document.createElement("button");
    cityBtn.textContent = city
    // append to the search history container
    searchHistoryEl.append(cityBtn)
  }
}
  
// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // push search term into search history array
  searchHistoryArr.push(search)
  // set search history array to local storage
  localStorage.setItem("history", JSON.stringify(searchHistoryArr));
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  // get search history item from local storage
  if (localStorage.getItem("history") !== null) { 
    // set search history array equal to what you got from local storage
    searchHistoryArr = JSON.parse(localStorage.getItem("history"))
  } else {
    localStorage.setItem("history", JSON.stringify(searchHistoryEl))
  }
   
    
  renderSearchHistory();
}
  
// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  todaysWeatherEl.classList.remove('d-none')
  // Store response data from our fetch request in variables
  // temperature, wind speed, etc.
  var temp = weather.current.temp;
  var wind = weather.current.wind_speed;
  var humidity = weather.current.humidity;
  var clouds = weather.current.clouds;
  // document.create the elements you'll want to put this information in  
  
  // append those elements somewhere
    
  // give them their appropriate content
  cityDateEl.textContent = [city + " " + currentDay]
  tempEl.textContent = ["Temp: " + temp + "°C"]
  windEl.textContent = ["Wind: " + wind + "kph"]
  humidityEl.textContent = ["Humidity: " + humidity + "%"]
  cloudEl.textContent = clouds
}
  
// Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
// daily forecast.
function renderForecastCard(forecast) {
  forecastEl.classList.remove('d-none')
  // variables for data from api
    // temp, windspeed, etc.
  
  // Create elements for a card
  
  // append
  
  // Add content to elements
  
  // append to forecast section
}
  
// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
// set up elements for this section
    
// append
  
// loop over dailyForecast
  
  for (var i = 0; i < 6; i++) {
  
    // send the data to our renderForecast function as an argument
      renderForecastCard(dailyForecast[i]);
  }
}
  
function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0]);
  renderForecast(data.list);
}
  
// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(lat, lon, city) {
  // varialbles of longitude, latitude, city name - coming from location
  var cityLat = lat;
  var cityLon = lon;
  var cityName = city;
  // api url
  var apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely,hourly,alerts&appid=${myAPIKey}`
  // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
  fetch(apiUrl)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        renderItems(cityName, data);
      })
    }
  })
}
  
function fetchCoords(search) {
  // variable for you api url
  var city = search;
  // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
  var geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${myAPIKey}`;

  fetch(geoURL)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var lat = data[0].lat;
        var lon = data[0],lon;
        appendToHistory(search)
        fetchWeather(lat, lon, city);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch (function (error) {
    alert("Cannot connect to Openweathermap API");
  });
}
  
function handleSearchFormSubmit(e) {
  // Don't continue if there is nothing in the search form
  if (!cityInputEl.value) {
    alert("Enter a city name display weather")
    return;
  }
  
  e.preventDefault();
  var search = cityInputEl.value;
  fetchCoords(search);
  cityInputEl.value = "";
}
  
function handleSearchHistoryClick(e) {
  // grab whatever city is is they clicked
  search = e.target.textcontent;
  fetchCoords(search);
}

//init previous search buttons on reload
initSearchHistory();

// click event to run the handleFormSubmit
searchBtnEl.addEventListener("click", handleSearchFormSubmit);
// click event to run the handleSearchHistoryClick
searchHistoryEl,addEventListener('click', handleSearchHistoryClick);