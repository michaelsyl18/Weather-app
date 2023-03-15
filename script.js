const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const currentTempEl = document.getElementById('current-temp');
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const weatherForecastEl = document.getElementById('weather-forecast');
const searchBtn = document.getElementById('searchBtn');



const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



const button = document.getElementById("searchBtn"); // Get the button element by ID

button.addEventListener("click", function() { // Add a click event listener to the button

// Define the city and state to search for
const city = document.getElementById('search-city');
const state = document.getElementById('search-state');

// Define the API URL with the city and state parameters
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value.trim()},${state.value.trim()}&appid=${API_KEY}`;

// Use the fetch API to make a request to the API URL
fetch(apiUrl)
  .then(response => response.json()) // Convert the response to JSON format
  .then(data => {

// Extract the latitude and longitude coordinates from the API response
    const lat = data.coord.lat;
    const long = data.coord.lon;

    // Log the coordinates to the console
    console.log(`The coordinates for ${city}, ${state} are: ${lat}, ${long}`);

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(wData => {

        console.log(wData)
        showWeatherData(wData);
        })
  })
  .catch(error => {
    // Handle any errors that may occur during the API request
    console.error(`Error fetching data: ${error}`);
  });
});

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const hour = time.getHours();
    const date = time.getDate();
    const day = time.getDay();
    const hoursIn24HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn24HrFormat < 10? '0'+hoursIn24HrFormat : hoursIn24HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {

        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
};



function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div> `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>`
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&deg;F</div>
                <div class="temp">Day - ${day.temp.day}&deg;F</div>
            </div>`
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}
