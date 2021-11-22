
var cityDefault = 'quebec'
const weatherApiKey = ''
const day = new Date();
const weekday = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat'];
var forecastDays = [];

// TODO: Refactor this cancer
const get3days= () => {
    let cpt = 0;
    let currentDay = day.getDay()
    if(currentDay > 3){
        for (let index = currentDay+1; index <= 6; index++) {
            forecastDays.push(index)
            cpt++
        }
        if(cpt < 3 || forecastDays.length < 3) for (let index = 0; index < 3; index++) {
            forecastDays.push(index)
            if (forecastDays.length === 3) {
                break
            }
        }
    } else for (let index = currentDay + 1; index < currentDay + 4; index++) {
        forecastDays.push(index)
    }
}

const getCoordinates = async (cityName)=> {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${weatherApiKey}`)
        const json = await response.json();
       let lat = json[0]['lat']
       let long = json[0]['lon']
       document.getElementById('city_name').innerText = json[0]['name']
       weatherData(lat, long)
    } catch (error) {
        
    }
}

const weatherData = async(lat, lon) => {
    try {
       const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`);
       const json = await response.json();
       console.log(json);
       fillWeatherData(json)
    }
    catch (e) {
       console.log(`Error: ${e.message}`);
    }
}

document.getElementById("city_input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
        getCoordinates(this.value);
        this.value =''
        this.blur();
    }
});

const fillWeatherData = (data) => {
    let currentTemp = Number(data['current']['temp'])
    let iconId = data['current']['weather'][0]['icon']
    document.getElementById('temp_top').innerText = Math.round(currentTemp) + '°C'
    document.getElementById('condition_top').innerText = data['current']['weather'][0]['main']
    document.getElementById('weather_icon').src = `http://openweathermap.org/img/wn/${iconId}@4x.png`
    for (let index = 0; index < 3; index++) {
        let forcastedTemp = Number(data['daily'][index]['temp']['day'])
        let weatherIconId = data['daily'][index]['weather'][0]['icon']
        document.getElementById(`forecast_temp_${index}`).innerText = Math.round(forcastedTemp) + '°C'
        document.getElementById(`forecast_day_${index}`).innerText = weekday[forecastDays[index]]
        document.getElementById(`forecast_weather_${index}`).innerText = data['daily'][index]['weather'][0]['main']
        document.getElementById(`forecast_img_${index}`).src = `http://openweathermap.org/img/wn/${weatherIconId}@2x.png`
    }
}

get3days()
getCoordinates(cityDefault)
