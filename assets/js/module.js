'use strict'

export const WeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// dateunix = Unix date in seconds
// timezone = Timezone shift from UTC in seconds

export const GetDate = function(dateunix, timezone) {
    const date = new Date((dateunix + timezone) * 1000)
    const WeekDayName = WeekDays[date.getUTCDay()]
    const MonthName = Months[date.getUTCMonth()]

    return `${WeekDayName} ${date.getUTCDate()}, ${MonthName}`
}

export const GetTime = function(timeunix, timezone) {
    const date = new Date((timeunix + timezone) * 1000)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const period = hours >= 12 ? "PM" : "AM"

    return `${hours % 12 || 12}:${minutes} ${period}`
}

export const GetHours = function(timeunix, timezone) {
    const date = new Date((timeunix + timezone) * 1000)
    const hours = date.getUTCHours()
    const period = hours >= 12 ? "PM" : "AM"

    return `${hours % 12 || 12} ${period}`
}

export const MpsToKmh = mps => {
    const mph = mps * 3600
    return mph / 1000
}

export const AirQualityText = {
    1: {
        level: "Good",
        message: "Air quality is considerd satisfactory, and air pollution poses little or no risk"
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    },
    5: {
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
    }
}