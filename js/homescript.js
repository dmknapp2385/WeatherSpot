var searchCityarray = []
var searchButton = document.querySelector("#search");

// function to get city name when search is hit
var searchCity = function(event) {
    event.preventDefault();
    var city = document.querySelector("#city-box").value;
    if (!city) {
        alert("Please enter a city or choose a previous location.");
    }
    else{
        geoLocate(city);
    }
};

// function to get api data for lat and long

var geoLocate = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=1afc6727533d71d7e158d0e563485a07";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.length === 0) {
                    alert("Error: City not Found");
                }
                else {
                    saveCity(city, data[0].lat, data[0].lon);
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
                
                var todayTemp = document.querySelector("#today .temp").textContent = "Temp: " + currentDayObj.temp;

                var todayWind = document.querySelector("#today .wind").textContent = "Wind: " + currentDayObj.wind;

                var todayHumidity = document.querySelector("#today .humidity").textContent = "Humidity: " + currentDayObj.humidity;

                var uvi = currentDayObj.uv;

                // go to switch function to get uvi data
                switchUVI(uvi);
                // go to condition function to set background image
                backgroundImage(currentDayObj.condition);
                // call forecast funciton
                forecast(data.daily);
            });
        }
        else {
            alert ("Error: Cannot get Weather information at this time");
        }
    });
}

// switch function to set uvi background
var switchUVI =function(uvi) {
    var todayUV = document.querySelector("#today .uv span").textContent = uvi; 
    switch (uvi) {
        case (uvi <= 2):
            todayUV.className = 'green';
            break;
        case (uvi <= 5):
            todayUV.className = "orange";
            break;
        default:
            todayUV.className = "red";
            break;
    }
}

// function to set background image based on condition: snowy, rainy, clear, cloudy, or low visibility
var backgroundImage = function(condition) {
    console.log(condition);
}

// forecast function
var forecast = function(data) {
    for (var i = 0; i < 5; i++) {

    }
}

// for loop to go over the next five days from daily data in api
               
            
                    // data.weather.main can be clear (thunderstomr, drizzle,rain), snow, clouds, other (hazy conditions)




// store lat and long and city in local storage
var saveCity = function (city, lat, long) {
    var cityObj = {"city": city, "latitude": lat, "longitude": long};
    searchCityarray.push(cityObj);
    localStorage.setItem("cities", JSON.stringify(searchCityarray));
    weatherData(city, lat, long);
}

// load cities to load most recent five cities
var loadCities = function() {
    var searchHistoryCities = localStorage.getItem("cities");

}
    // load cities and geo locations into array
    // delete oldest if more than five
    // create buttons for
    // on click function that places name and location into weatherData function

// function to take history buttons get weather with lat and long
var historyButtonHandler = function(event) {

}

searchButton.addEventListener("click", searchCity);