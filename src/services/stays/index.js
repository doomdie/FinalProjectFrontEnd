const { DEV, VITE_LOCAL } = import.meta.env

// import { stayService as local } from './stays.service.local'
import { stayService as remote } from './stays.service.remote'


// Easy access to this service from the dev tools console
// when using script - dev / dev:local
function getEmptyStay() {
    return {
        name: '',
        type: '',
        imgUrls: [],
        price: 0,
        capacity: 1,
        loc: {
            country: '',
            city: '',
            address: '',
            lat: 0,
            lng: 0
        },
        labels: [],
        amenities: [],
        reviews: [],
        msgs: []
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        minPrice: '',
        startDate: '',
        endDate: '',
        sortField: '',
        sortDir: ''
    }
}

// const service = (VITE_LOCAL === 'true') ? local : remote
const service = remote


export const stayService = { getEmptyStay, getDefaultFilter, ...service }
if (DEV) window.reviewService = stayService
// REMEMBER TO CHANGE THIS TO STAYS YAIR!!!