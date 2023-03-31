'use strict'

const ApiKey = 'fcb795032a474eb09b5b27268b07377d'

export const FetchData = function(URL, CallBack) {
    fetch(`${URL}&appid=${ApiKey}`)
    .then(res => res.json())
    .then(data => CallBack(data))
}

export const url = {
    CurrentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    Forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },
    AirPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    ReverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}