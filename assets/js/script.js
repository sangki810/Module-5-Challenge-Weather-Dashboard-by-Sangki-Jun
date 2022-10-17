// Global variables
var myAPIKey = '79ccccbf056ad9d002777e1e5b09a098';
var city;
const searchHistoryArr = [];
var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${myAPIKey}`;
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
    // append to the search history container
    cityBtn.setAttribute("class", "form-control mt-3");
    searchHistoryEl.append(cityBtn);
  }
}
  
// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // push search term into search history array
  searchHistoryArr.push(search);
  // set search history array to local storage
  localStorage.setItem(search, search);
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  // get search history item from local storage
  localStorage.getItem("history") 
  // set search history array equal to what you got from local storage
  //searchHistoryArr = localStorage.getItem("history");
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
  // document.create the elements you'll want to put this information in  
  
  // append those elements somewhere
    
  // give them their appropriate content
  cityNameDateEl.textContent = city + " " + date;
  iconEl.textContent = icon;
  tempEl.textContent = "Temp: " + temp + "°C";
  windEl.textContent = "Wind: " + wind + "kph";
  humidityEl.textContent = "Humidity: " + humidity + "%";
}
  
// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
  forecastEl.innerHTML = "";
  weeklyHeaderEl.classList.remove('d-none')
  // set up elements for this section
  
  // append
  
  // loop over dailyForecast
  
  for (var i = 0; i < 5; i++) { 
    var temp = dailyForecast[i].main.temp;
    var wind = dailyForecast[i].wind.speed;
    var humidity = dailyForecast[i].main.humidity;
    var icon = dailyForecast[i].weather[0].main; 
    
    var forecastCardEl = document.createElement('div');
    forecastCardEl.setAttribute("class", "col-md-2 card");
    var dateCardEl = document.createElement('h5');
    var iconCardEl = document.createElement('p');
    var tempCardEl = document.createElement('p');
    var speedCardEl = document.createElement('p');
    var humidityCardEl = document.createElement('p');

    
    forecastEl.append(forecastCardEl);
    forecastCardEl.append(dateCardEl);
    forecastCardEl.append(iconCardEl);
    forecastCardEl.append(tempCardEl);
    forecastCardEl.append(speedCardEl);
    forecastCardEl.append(humidityCardEl);

    dateCardEl.textContent = dayjs().add(i+1, "day").format("MM/DD/YYYY");
    iconCardEl.textContent = icon;
    tempCardEl.textContent = "Temp: " + temp + "°C";
    speedCardEl.textContent = "Wind: " + wind + "kph";
    humidityCardEl.textContent = "Humidity: " + humidity + "%";
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
  // api url
  var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=metric&appid=${myAPIKey}`;
  // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
  fetch(weatherUrl)
  .then(function (response) {
    if (response.ok) {
      response.json()
      .then(function (data) {
        renderItems(city, data);
      })
    } else {
      alert('Error: could not retrieve data');
    }
  });
}
  
function fetchCoords(search) {
  // variable for you api url
  var city = search;
  // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
  var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&units=metric&appid=${myAPIKey}`;

  fetch(geoUrl)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        appendToHistory(search)
        fetchWeather(lat, lon, city);
      });
    } else {
      alert('Error: could not retrieve data');
    }
  });
}
  
function handleSearchFormSubmit(e) {
  // Don't continue if there is nothing in the search form
  if (!cityInputEl.value) {
    alert("Enter a city name to display weather")
    return;
  }
  
  e.preventDefault();
  var search = cityInputEl.value;
  fetchCoords(search);
  cityInputEl.value = "";
}
  
function handleSearchHistoryClick(e) {
  // grab whatever city it is they clicked
  search = e.target.textcontent;
  fetchCoords(search);
}

//init previous search buttons on reload
initSearchHistory();

// click event to run the handleFormSubmit
searchBtnEl.addEventListener("click", handleSearchFormSubmit);
// click event to run the handleSearchHistoryClick
searchHistoryEl.addEventListener('click', handleSearchHistoryClick);