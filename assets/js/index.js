'use strict'

import { FetchData, url } from "./api.js"
import * as module from "./module.js"

// CHECK CONNECTION

const CheckConnection = document.querySelector(".check__connection")
const Toast = CheckConnection.querySelector(".toast")
const WifiIcon = CheckConnection.querySelector(".icon")
const CloseIcon = CheckConnection.querySelector(".close-icon")
const Title = CheckConnection.querySelector(".details span")
const SubTitle = CheckConnection.querySelector(".details p")

window.addEventListener('offline', () => {
    CheckConnection.style.display = "block"
    Toast.classList.remove("offline")
    Title.innerText = "You're Offline"
    SubTitle.innerText = "You Are Not Connected To Internet."
    WifiIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>'
})

window.addEventListener('online', () => {
    CheckConnection.style.display = "block"
    Toast.classList.remove("offline")
    Title.innerText = "You're Online Now"
    SubTitle.innerText = "Yay! You Are Connected To Internet."
    WifiIcon.innerHTML = '<i class="fa-solid fa-wifi"></i>'

    setTimeout(() => {
        CheckConnection.classList.add("hide")
    }, 5000)
})

CloseIcon.onclick = () => {
    CheckConnection.classList.add("hide")
}

const addEventOnElements = function(elements, eventType, callBack) {
    for (const element of elements) element.addEventListener(eventType, callBack)
}

const SearchView = document.querySelector("[data-search-view]")
const SearchTogglers = document.querySelectorAll("[data-search-toggler]")

const ToggleSearch = () => SearchView.classList.toggle("active")
addEventOnElements(SearchTogglers, "click", ToggleSearch)

const SearchField = document.querySelector("[data-search-field]")
const SearchResult = document.querySelector("[data-search-result]")

let SearchTimeout = null
const SearchTimeoutDuration = 500

SearchField.addEventListener("input", function() {
    SearchTimeout ?? clearTimeout(SearchTimeout)

    if(!SearchField.value) {
        SearchResult.classList.remove("active")
        SearchResult.innerHTML = ""
        SearchField.classList.remove("searching")
    } else {
        SearchField.classList.add("searching")
    }

    if(SearchField.value) {
        SearchTimeout = setTimeout(() => {
            FetchData(url.geo(SearchField.value), function (locations) {
                SearchField.classList.remove("searching")
                SearchResult.classList.add("active")
                SearchResult.innerHTML = `<ul class="view-list" data-search-list></ul>`
                
                const items = []

                for (const {name , lat, lon, country, state} of locations) {
                    const SearchItem = document.createElement("li")
                    SearchItem.classList.add("view-item")

                    SearchItem.innerHTML = `
                            <i class="fa-solid fa-location-dot"></i>

                            <div>
                                <p class="item-title">${name}</p>
                                <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
                            </div>

                            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>`
                    
                    SearchResult.querySelector("[data-search-list]").appendChild(SearchItem)
                    items.push(SearchItem.querySelector("[data-search-toggler]"))
                }

                addEventOnElements(items, "click", function () {
                    ToggleSearch()
                    SearchResult.classList.remove("active")
                })
            })
        }, SearchTimeoutDuration)
    }
})

const Container = document.querySelector("[data-container]")
const Loading = document.querySelector("[data-loading]")
const CurrentLocationBtn = document.querySelector("[data-current-location-btn]")
const ErrorContent = document.querySelector("[data-error-content]")

export const UpdateWeather = (lat, lon) => {
    Loading.style.display = "block"
    Container.style.overflowY = "hidden"
    Container.classList.remove("fade-in")
    ErrorContent.style.display = "none"

    const CurrentWeatherSection = document.querySelector("[data-current-weather]")
    const HighlightSection = document.querySelector("[data-highlights]")
    const HourlySection = document.querySelector("[data-hourly-forecast]")
    const ForecastSection = document.querySelector("[data-5-day-forecast]")

    CurrentWeatherSection.innerHTML = ""
    HighlightSection.innerHTML = ""
    HourlySection.innerHTML = ""
    ForecastSection.innerHTML = ""

    if(window.location.hash === "#/current-location") {
        CurrentLocationBtn.setAttribute("disabled", "")
    } else {
        CurrentLocationBtn.removeAttribute("disabled")
    }

    FetchData(url.CurrentWeather(lat, lon), function(currentWeather) {
        const {
            weather,
            dt: dateUnix,
            sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, pressure, humidity},
            visibility, 
            timezone
        } = currentWeather

        const [{description, icon}] = weather

        const card = document.createElement("div")
        card.classList.add("card", "card-lg", "current-weather-card")

        card.innerHTML = `
            <h2 class="title-2 card-title">Now</h2>

                <div class="wrapper">
                    <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

                    <img src="assets/images/Weather_Icons/${icon}.png" alt="${description}" class="weather-icon" draggable="false">
                </div>

                <p class="body-3">${description}</p>

                <ul class="meta-list">
                    <li class="meta-item">
                        <i class="fa-regular fa-calendar"></i>

                        <p class="title-3 meta-text">${module.GetDate(dateUnix, timezone)}</p>
                    </li>

                    <li class="meta-item">
                        <i class="fa-solid fa-location-dot"></i>

                        <p class="title-3 meta-text" data-location></p>
                    </li>
                </ul>`
        
        FetchData(url.ReverseGeo(lat, lon), function([{name, country}]) {
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
        })
            
        CurrentWeatherSection.appendChild(card)

        // TODAY'S HIGHLIGHTS
        FetchData(url.AirPollution(lat, lon), function(airPollution) {
            const [{
                main: {aqi},
                components: {no2, o3, so2, pm2_5}
            }] = airPollution.list

            const card = document.createElement("div")
            card.classList.add("card", "card-lg")

            card.innerHTML = `
                        <h2 class="title-2" id="highlights-label">Today's Highlights</h2>

                        <div class="highlight-list">
                            <div class="card card-sm highlight-card one">
                                <h3 class="title-3">Air Quality Index</h3>

                                <div class="wrapper">
                                    <i class="fa-solid fa-wind"></i>

                                    <ul class="card-list">
                                        <li class="card-item">
                                            <p class="title-1">${pm2_5.toPrecision(3)}</p>

                                            <p class="label-1">PM <sub>2.5</sub></p>
                                        </li>

                                        <li class="card-item">
                                            <p class="title-1">${so2.toPrecision(3)}</p>

                                            <p class="label-1">SO <sub>2</sub></p>
                                        </li>

                                        <li class="card-item">
                                            <p class="title-1">${no2.toPrecision(3)}</p>

                                            <p class="label-1">NO <sub>2</sub></p>
                                        </li>

                                        <li class="card-item">
                                            <p class="title-1">${o3.toPrecision(3)}</p>

                                            <p class="label-1">O <sub>3</sub></p>
                                        </li>
                                    </ul>
                                </div>

                                <span class="badge aqi-${aqi} label-${aqi}" title="${module.AirQualityText[aqi].message}">
                                    ${module.AirQualityText[aqi].level}
                                </span>
                            </div>

                            <div class="card card-sm highlight-card two">
                                <h3 class="title-3">Sunrise & Sunset</h3>

                                <div class="card-list">
                                    <div class="card-item">
                                        <i class="fa-regular fa-sun"></i>

                                        <div>
                                            <p class="label-1">Sunrise</p>

                                            <p class="title-1">${module.GetTime(sunriseUnixUTC, timezone)}</p>
                                        </div>
                                    </div>

                                    <div class="card-item">
                                        <i class="fa-regular fa-moon"></i>

                                        <div>
                                            <p class="label-1">Sunset</p>

                                            <p class="title-1">${module.GetTime(sunsetUnixUTC, timezone)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Humidity</h3>

                                <div class="wrapper">
                                    <i class="fa-solid fa-droplet"></i>

                                    <p class="title-1">${humidity}<sub>%</sub></p>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Pressure</h3>

                                <div class="wrapper">
                                    <i class="fa-solid fa-tornado"></i>

                                    <p class="title-1">${pressure}<sub>hPa</sub></p>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Visibility</h3>

                                <div class="wrapper">
                                    <i class="fa-solid fa-eye"></i>

                                    <p class="title-1">${visibility / 1000}<sup>km</sup></p>
                                </div>
                            </div>

                            <div class="card card-sm highlight-card">
                                <h3 class="title-3">Feels Like</h3>

                                <div class="wrapper">
                                    <i class="fa-solid fa-temperature-high"></i>

                                    <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                                </div>
                            </div>
                        </div>`

            HighlightSection.appendChild(card)
        })

        // 24 HOUR FORECAST
        FetchData(url.Forecast(lat ,lon), function(forecast) {
            const {
                list: forecastList,
                city: {timezone}
            } = forecast

            HourlySection.innerHTML = `
                    <h2 class="title-2">Today at</h2>

                    <div class="slider-container">
                        <ul class="slider-list" data-temp></ul>

                        <ul class="slider-list" data-wind></ul>
                    </div>`

            for(const [index, data] of forecastList.entries()) {
                if(index > 7) break

                const {
                    dt: dateTimeUnix,
                    main: {temp},
                    weather,
                    wind: {deg: windDirection, speed: windSpeed}
                } = data

                const [{icon, description}] = weather

                const tempLi = document.createElement("li")

                tempLi.classList.add("slider-item")

                tempLi.innerHTML = `
                    <div class="card card-sm slider-card">
                        <p class="body-3">${module.GetHours(dateTimeUnix, timezone)}</p>

                        <img src="assets/images/Weather_Icons/${icon}.png" loading="lazy" draggable="false" width="48" height="48" alt="${description}" title="${description}" class="weather-icon">
                                
                        <p class="body-3">${parseInt(temp)}&deg;</p>
                    </div>`

                HourlySection.querySelector("[data-temp]").appendChild(tempLi)

                const WindLi = document.createElement("li")

                WindLi.classList.add("slider-item")

                WindLi.innerHTML = `
                    <div class="card card-sm slider-card">
                        <div class="card card-sm slider-card">
                            <p class="body-3">${module.GetHours(dateTimeUnix, timezone)}</p>
    
                            <img src="assets/images/Weather_Icons/direction.png" loading="lazy" draggable="false" width="48" height="48" alt="direction" class="weather-icon" style="transform: rotate(${windDirection - 180}deg)">
                                    
                            <p class="body-3">${parseInt(module.MpsToKmh(windSpeed))} km/h</p>
                        </div>
                    </div>`

                HourlySection.querySelector("[data-wind]").appendChild(WindLi)
            }

            // 5 DAYS FORECAST SECTION
            ForecastSection.innerHTML = `
                    <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>

                    <div class="card card-lg forecast-card">
                        <ul data-forecast-list></ul>
                    </div>`

            for(let i = 7, len = forecastList.length ; i < len ; i+=8) {
                const {
                    main: {temp_max},
                    weather,
                    dt_txt
                } = forecastList[i]

                const [{icon, description}] = weather

                const date = new Date(dt_txt)
                
                const li = document.createElement("li")

                li.classList.add("card-item")

                li.innerHTML = `
                    <div class="icon-wrapper">
                        <img src="assets/images/Weather_Icons/${icon}.png" draggable="false" width="36" height="36" alt="${description}" class="weather-icon" title="${description}">
                                    
                        <span class="span">
                            <p class="title-2">${parseInt(temp_max)}&deg;</p>
                        </span>
                    </div>

                    <p class="label-1">${date.getDate()} ${module.Months[date.getUTCMonth()]}</p>

                    <p class="label-1">${module.WeekDays[date.getUTCDay()]}</p>`

                ForecastSection.querySelector("[data-forecast-list]").appendChild(li)
            }

            Loading.style.display = "none"
            Container.style.overflowY = "overlay"
            Container.classList.add("fade-in")
        })
    })
}

export const Error404 = () =>  ErrorContent.style.display = "grid"