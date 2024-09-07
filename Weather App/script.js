const searchInput = document.querySelector('.search-input');
const currentWeather = document.querySelector('.current-weather');
const API_KEY = '50463001541b407dbee124432240709'
// const icon = document.querySelector('.weather-icon');
const hourlyWeatherHTML = document.querySelector('.hourly-weather .weather-list');
const WeatherCode = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    rain: [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276, 1279],
    snow: [1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264, 1279, 1282],
    thunderstorm: [1087, 1276, 1279, 1282],
    mist: [1030, 1135, 1147, 1150, 1153, 1168, 1171, 1180, 1198, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 1243, 1246, 1249, 1252, 1255, 1258, 1261, 1264, 1273, 1279, 1282],
    thunder: [1087, 1276, 1279, 1282],
    thunder_rain: [1273,1276],
}


const displayHourlyData = (hourlyData) => {
    const currentHour = new Date().getMinutes(0,0,0);
    const next24Hours = currentHour + 24 * 60 *60 *1000;

    //Filter out the hourly data for the next 24 hours
    const next24HoursData = hourlyData.filter(({time}) =>{
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    hourlyWeatherHTML.innerHTML = next24HoursData.map(item =>{
        const temperature = Math.floor(item.temp_c)
        const time = item.time;
        const Weathericon = Object.keys(WeatherCode).find(icon => WeatherCode[icon].includes(item.condition.code));

        return `<li class="weather-item">
                    <p class="time">${time}</p>
                    <img src="images/${Weathericon}.svg" alt="" class="weather-icon">
                    <p class="temperature">${temperature}<span>&deg;C</span></p>
                </li>`;
    }).join("");
    // console.log(next24HoursData);
}


const getWeatherData = async (cityName) => {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}`;

    try {
        // Fetch weather data from the API and parse the respose as JSON
        const response = await fetch(API_URL);
        const data = await response.json();
        
        //Extract the data we need details
        const temperature = Math.floor(data.current.temp_c);
        const description = data.current.condition.text;
        const Weathericon = Object.keys(WeatherCode).find(icon => WeatherCode[icon].includes(data.current.condition.code)); 
        
        
        currentWeather.querySelector('.weather-icon').src = `images/${Weathericon}.svg`;
        currentWeather.querySelector('.temperature').innerHTML = `${temperature}<span>&degC</span>`;
        currentWeather.querySelector('.description').innerHTML = description;
        
        
        //Combine hourly data from today and tomorrow
        const combinehour1 = data.forecast.forecastday[0];
        const combinehour2 = data.forecast.forecastday[1];
        const combine = combinehour1.hour.concat(combinehour1.hour);
        console.log(combine)
        // const combineHourlyData = [...combinehour1.hour,...combinehour2.hour];
        // console.log(data.forecast.forecastday[0])
        // console.log(combinehour1.hour)
        // console.log(combinehour2)
        // console.log(data)
        // console.log(combineHourlyData);
        displayHourlyData(combine);
    } catch (error) {
        console.log(error);
    }

}

searchInput.addEventListener('keyup', (e) => {
  const cityName = searchInput.value.trim();

  if(e.key == "Enter" && cityName){
    getWeatherData(cityName);
  }
});