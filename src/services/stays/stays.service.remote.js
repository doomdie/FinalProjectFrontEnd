import { httpService } from '../http.service'

export const stayService = {
    query,
    getById,
    save,
    remove,
    getEmptyStay
}

async function query(filterBy = {}) {
    return httpService.get('stay', filterBy)
}

function getById(stayId) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}

async function save(stay) {
    let savedStay
    if (stay._id) {
        savedStay = await httpService.put(`stay/${stay._id}`, stay)
    } else {
        savedStay = await httpService.post('stay', stay)
    }
    return savedStay
}

function getEmptyStay() {
    return {
        name: '',
        type: '',
        imgUrls: [],
        price: 0,
        summary: '',
        capacity: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        labels: [],
        loc: {
            country: '',
            countryCode: '',
            city: '',
            address: '',
            lat: 0,
            lng: 0
        },
        reviews: [],
        likedByUsers: []
    }
}