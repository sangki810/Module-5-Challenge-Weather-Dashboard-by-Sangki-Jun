// Global variables
var city;
// search history as an empty array
var searchHistoryArr = [];
// weather api root url
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myAPIKey;
// api key
var myAPIKey = "79ccccbf056ad9d002777e1e5b09a098";
var currentDay = moment().format("M/DD/YYY");

// DOM element references
// search form
// search input
var cityInputEl = document.getElementById("city-input");
// container/section for today's weather
var todaysWeatherEl = document.getElementById("todays-weather");
// container/section for the forecast 
var forecastEl = document.getElementById('weekly-forecast');
// search history container
var searchHistoryEl = document.getElementById("search-history");
var todaysWeatherEl = document.getElementById('todays-weather');
var cityDateEl = document.getElementById("city-name");
var tempEl =  document.getElementById('temperature');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var cloudEl = document.getElementById('weather-icon');

// Function to display the search history list.
function renderSearchHistory() {
    // empty the search history container
    searchHistoryEl.innerHTML = " ";
    // loop through the history array creating a button for each item
    for (var i = 0; i < searchHistoryArr.length; i++) {
        var newBtn = document.createElement("button");
        newBtn.textContent = searchHistoryArr[i]
        // append to the search history container
        searchHistoryEl.append(newBtn)
    }
  }
  
  // Function to update history in local storage then updates displayed history.
  function appendToHistory(search) {
    // push search term into search history array
    searchHistoryArr.push(search)
    // set search history array to local storage
    localStorage.setItem("history", JSON.stringify(searchHistoryEl));
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
    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;
    var clouds = weather.clouds;
    // document.create the elements you'll want to put this information in  
    if (clouds > 50) {
      clouds = "☁️";
    } else if (clouds>30) {
      clouds = "⛅";
    } else if (clouds > 10) {
      clouds = "🌤️";
    } else {
      clouds = "☀️";
    }
    // append those elements somewhere
    
    // give them their appropriate content
    cityDateEl.textContent = [city + " " + currentDay]
    tempEl.textContent = ["Temp: " + temp + "°F"]
    windEl.textContent = ["Wind: " + wind + "mph"]
    humidityEl.textContent = ["Humidity: " + humidity + "%"]
    cloudEl.textContent = clouds
  }
  
  // Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
  // daily forecast.
  function renderForecastCard(forecast) {
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
  function fetchWeather(location) {
    // varialbles of longitude, latitude, city name - coming from location
  
    // api url
  
    // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
  
  }
  
  function fetchCoords(search) {
    // variable for you api url
  
    // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
  
  }
  
  function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  }
  
  function handleSearchHistoryClick(e) {
    // grab whatever city is is they clicked
    
    fetchCoords(search);
  }
  
  initSearchHistory();
  // click event to run the handleFormSubmit 
  // click event to run the handleSearchHistoryClick