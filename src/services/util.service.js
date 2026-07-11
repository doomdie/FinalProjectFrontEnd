export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}


// FAKE rating — no numeric rating in data, derived from END of _id.
// ONE source of truth: every page imports this.
export function getFakeRating(stay) {
    if (!stay?._id || stay._id.length < 3) return 4.8
    const idLen = stay._id.length
    const ratingSeed = stay._id.charCodeAt(idLen - 1) * 31 + stay._id.charCodeAt(idLen - 2) * 17 + stay._id.charCodeAt(idLen - 3) * 7
    return parseFloat((4.6 + (ratingSeed % 40) / 100).toFixed(2))
}

export function getYearsSince(dateVal) {
    if (!dateVal) return 1
    return Math.max(1, new Date().getFullYear() - new Date(dateVal).getFullYear())
}
// FAKE hosting years — no such data, derived from END of _id like the rating. Stable per stay, 2–11 years.
export function getFakeHostingYears(stay) {
    if (!stay?._id || stay._id.length < 3) return 5
    const idLen = stay._id.length
    const seed = stay._id.charCodeAt(idLen - 1) * 23 + stay._id.charCodeAt(idLen - 2) * 11
    return 2 + (seed % 10)
}


// FAKE — deterministic dates from the END of the _id (same seed style as getFakeRating)
// returns real Date objects so both the search card and the sticky card agree
export function getFakeDates(stay) {
    if (!stay?._id) return null
    const idLen = stay._id.length
    const dateSeed =
        stay._id.charCodeAt(idLen - 1) * 13 +
        stay._id.charCodeAt(idLen - 2) * 29 +
        stay._id.charCodeAt(idLen - 3) * 5

    const startDay = 1 + (dateSeed % 27)
    const span = 3 + ((dateSeed >> 2) % 6)
    const monthIdx = 6 + ((dateSeed >> 4) % 2)   // 6=Jul, 7=Aug
    const endDay = Math.min(startDay + span, 30)

    const year = new Date().getFullYear()
    return {
        checkIn: new Date(year, monthIdx, startDay),
        checkOut: new Date(year, monthIdx, endDay),
    }
}



// one source of truth for the total price shown everywhere
export function getTotalPrice(stay, checkIn, checkOut) {
    if (!stay?.price || !checkIn || !checkOut) return 0
    const nights = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)))
    return stay.price * nights
}