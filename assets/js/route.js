'use strict'

import { UpdateWeather, Error404 } from "./index.js"

const DefaultLocation = "#/weather?lat=36.7651739&lon=45.7218136"

const CurrentLocation = function() {
    window.navigator.geolocation.getCurrentPosition(res => {
        const {latitude, longitude} = res.coords

        UpdateWeather(`lat=${latitude}`, `lon=${longitude}`)
    }, err => {
        window.location.hash = DefaultLocation
    })
}

const SearchedLocation = query => UpdateWeather(...query.split("&"))

const Routes = new Map([
    ["/current-location", CurrentLocation],
    ["/weather", SearchedLocation]
])

const CheckHash = function() {
    const RequestURL = window.location.hash.slice(1)

    const [route, query] = RequestURL.includes ? RequestURL.split("?") : [RequestURL]

    Routes.get(route) ? Routes.get(route)(query) : Error404()
}

window.addEventListener("hashchange", CheckHash)

window.addEventListener("load", function() {
    if(!window.location.hash) {
        window.location.hash = "#/current-location"
    } else {
        CheckHash()
    }
})