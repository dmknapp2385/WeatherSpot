var searchCityarray = [];
var historyDiv = document.querySelector("#city-history");
var searchButton = document.querySelector("#search");

// function to get city name when search is hit
var searchCity = function(event) {
    event.preventDefault();
    var cityBox = document.querySelector("#city-box");
    var city = cityBox.value;
    cityBox.value = "";

    if (!city) {
        alert("Please enter a city or choose a previous location.");
    }
    else{
        geoLocate(city);
    }
};

// function to get api data for lat and long

var geoLocate = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=1afc6727533d71d7e158d0e563485a07";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.length === 0) {
                    alert("Error: City not Found");
                }
                else {
                    saveCity(city);
                    weatherData(city, data[0].lat, data[0].lon);
                }
            });
        }
        else {
            alert("Error: Site cannot be reached");
        }
    });
}

// function to get api data for weather with city lat and long.

var weatherData = function(city, lat, lon) {
    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=1afc6727533d71d7e158d0e563485a07";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // create formated date
                var date = new Date((data.current.dt)*1000);
                var dateMDY= (date.getMonth() + 1)+ "/" + date.getDate() + "/" + date.getFullYear();
                // create obj for current day
                var currentDayObj = {"date": dateMDY, "temp": data.current.temp, "humidity": data.current.humidity, "wind": data.current.wind_speed, "uv": data.current.uvi, "condition": data.current.weather[0].main};

                // populate today dive with current day stats
                var todayHeader = document.querySelector(".city").textContent = city.toUpperCase() + " (" + currentDayObj.date + "):";
                
                var todayTemp = document.querySelector("#today .temp").textContent = "Temp: " + currentDayObj.temp + "°F";

                var todayWind = document.querySelector("#today .wind").textContent = "Wind: " + currentDayObj.wind + " mph";

                var todayHumidity = document.querySelector("#today .humidity").textContent = "Humidity: " + currentDayObj.humidity + "%";

                var uvi = currentDayObj.uv;
                // go to switch function to get uvi data
                spanUVI(uvi);
                // go to condition function to set background image
                backgroundImage(currentDayObj.condition, "today");
                // call forecast funciton
                forecast(data.daily);
                
            });
        }
        else {
            alert ("Error: Cannot get Weather information at this time");
        }
    });
}

// if else functions to set uvi background
var spanUVI = function(uvi) {
    var todayUVhead = document.querySelector("#today .uv");
    todayUVhead.textContent = "UVI:  ";
    var todayUV = document.createElement("span");
    todayUV.textContent = uvi;
    todayUVhead.appendChild(todayUV);
    if (uvi <= 2) {
        todayUV.className = 'green';
    }
    else if (uvi>2 && uvi <= 5) {
        todayUV.className = "orange";
    }
    else {
        todayUV.className = "red";
    }
}


// function to set background image based on condition: snowy, rainy, clear, cloudy, or low visibility
var backgroundImage = function(condition, day) {
    console.log(condition, day);
    var currentDayDiv = document.querySelector("#" + day);
    if (condition === "Clear") {
        currentDayDiv.setAttribute("name", "clear");
    }
    else if (condition === "Rain" || condition === "Drizzle") {
        currentDayDiv.setAttribute("name", "rainy");
    }
    else if (condition === "Thunderstorm") {
        currentDayDiv.setAttribute("name", "stormy");
    }
    else if (condition === "Snow") {
        currentDayDiv.setAttribute("name", "snowy");
    }
    else if (condition === "Clouds") {
        currentDayDiv.setAttribute("name", "cloudy");
    }
    else {
        currentDayDiv.setAttribute("name", "hazy");
    }
}
        


// forecast function
var forecast = function(data) {
    // for loop to go over the next five days from daily data in api
    for (var i = 1; i < 6; i++) {
        // create formated date
        var date = new Date((data[i].dt)*1000);
        var dateMDY= (date.getMonth() + 1)+ "/" + date.getDate() + "/" + date.getFullYear();
        var dayHeader = document.querySelector("#day-" + i +" .date");
        dayHeader.textContent = dateMDY;
        var dayTemp = document.querySelector("#day-" + i + " .temp").textContent = "Temp: " + data[i].temp.day + "°F";

        var todayWind = document.querySelector("#day-" + i + " .wind").textContent = "Wind: " + data[i].wind_speed + " mph";

        var todayHumidity = document.querySelector("#day-" + i + " .humidity").textContent = "Humidity: " + data[i].humidity + "%";
        var condition = data[i].weather[0].main;
        backgroundImage(condition, "day-" + i);
    }
}


// store lat and long and city in local storage
var saveCity = function (city) {
    var city = city.toLowerCase();
    // check if city is repeat search
    if (searchCityarray.includes(city)) {
        return
        // maybe function to move city to front of array
    }
    else{
        // limit number of history cities viewed to 6
        if (searchCityarray.length > 3) {
            searchCityarray.splice(0, 1);
            searchCityarray.push(city);
        }
        else {
            searchCityarray.push(city);
        }
    }
    localStorage.setItem("cities", JSON.stringify(searchCityarray));
    // create button and append to history buttons
    createRecentsButtons(searchCityarray);
}


// create button form from recent cities
var createRecentsButtons = function (array) {
    //move this from savecity function after done with weather function
    historyDiv.textContent = "";
    for (var i = 0; i < array.length; i ++) {
        var historyButton = document.createElement("button");
        historyButton.className = "button is-primary is-large is-fullwidth"
        historyButton.setAttribute("id", array[i]);
        historyButton.textContent = array[i].toUpperCase();
        historyDiv.prepend(historyButton);
    }
};

// load cities to load most recent five cities
var loadCities = function() {
    searchCityarray = JSON.parse(localStorage.getItem("cities"));
    if (!searchCityarray) {
        searchCityarray = [];
    }
    else {
        createRecentsButtons(searchCityarray);
    }
}

// function to take history buttons get weather with lat and long
var historyButtonHandler = function(event) {
    var button = event.target
    if (button.matches("button")) {
        city = button.getAttribute("id");
        geoLocate(city);
    }
    else {
        return;
    }
}

loadCities();

historyDiv.addEventListener("click", historyButtonHandler);
searchButton.addEventListener("click", searchCity);