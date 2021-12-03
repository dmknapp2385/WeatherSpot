var searchCityarray = [
    // {"day": "current", "temp": , "humidity": "wind", "uv"},
    // {"day": "tomorrow", etc}
]
var searchButton = document.querySelector("#search");

// function to get city name when search is hit
var searchCity = function(event) {
    console.log("button clicked")
    var city = document.querySelector("#city-box").value;
    console.log(city);
    if (!city) {
        alert("Please enter a city or choose a previous location.");
    }
    else{
        geoLocate(city);
    }
}

// function to get api data for lat and long

var geoLocate = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=1afc6727533d71d7e158d0e563485a07";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                console.log(data.lat);
                console.log(city);
                weatherData(city, data.lat, data.lon);
                
            });
        }
        else {
            alert ("Error: City not Found");
        }
    });
}

// function to get api data for weather with city lat and long.

// var weatherData = function(city, lat, lon) {
//     apiUrl = 
//     //store data in object array with day temp humidity, etc
    
// }

// current day function to populate current day div

// forecast function to populate five day forecast in cards

// store lat and long and city in local storage
    //delete oldest if more than five

// load cities to load most recent five cities
    // load cities and geo locations into array
    // create buttons for
    // on click function that places name and location into weatherData function

searchButton.addEventListener("click", searchCity);