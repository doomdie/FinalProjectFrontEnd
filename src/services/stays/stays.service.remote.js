import { storageService } from '../async-storage.service.js'
import { makeId } from '../util.service.js'
import { userService } from '../user'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
}
window.cs = stayService


async function query(filterBy = { txt: '', minPrice: 0, startDate: '', endDate: '' }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { minPrice, sortField, sortDir, startDate, endDate } = filterBy

    // the search bar sends 'search', older filters send 'txt' — accept either
    const txt = filterBy.txt || filterBy.search

    // filter by free text: match against country or city
    if (txt) {
        const terms = txt.split(',').map(term => term.trim()).filter(term => term)

        stays = stays.filter(stay => {
            return terms.every(term => {
                const regex = new RegExp(term, 'i')
                return regex.test(stay.loc.country) || regex.test(stay.loc.city)
            })
        })
    }

    // filter by minimum price
    if (minPrice) {
        stays = stays.filter(stay => stay.price >= minPrice)
    }

    // filter by date availability
    if (startDate && endDate) {
        stays = stays.filter(stay => _isStayAvailable(stay, startDate, endDate))
    }

    // filter by amenities — stay must have ALL requested amenities (comma-separated)
    const { amenities, guests } = filterBy
    if (amenities) {
        const wanted = amenities.split(',').map(a => a.trim()).filter(a => a)
        stays = stays.filter(stay =>
            wanted.every(want => stay.amenities?.includes(want))
        )
    }

    // filter by guests — stay capacity must fit the requested number
    if (guests) {
        const guestCount = +guests
        if (guestCount > 0) {
            stays = stays.filter(stay => stay.capacity >= guestCount)
        }
    }

    // sorting
    if (sortField === 'owner') {
        stays.sort((stay1, stay2) => {
            const name1 = stay1.owner?.fullname || ''
            const name2 = stay2.owner?.fullname || ''
            return name1.localeCompare(name2) * +sortDir
        })
    }
    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }
    if (sortField === 'capacity') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }

    // trim each stay down to the fields the list needs, and compute avg rating
    stays = stays.map(({
        _id, name, type, imgUrls, price, capacity, host, loc, labels, amenities, reviews
    }) => {
        const reviewCount = reviews?.length || 0
        let avgRating = 'New'

        if (reviewCount > 0) {
            const totalScore = reviews.reduce((acc, rev) => acc + rev.rate, 0)
            avgRating = Math.round((totalScore / reviewCount) * 100) / 100
        }

        return {
            _id, name, type, imgUrls, price, capacity,
            host, loc, labels, amenities, avgRating, reviewCount
        }
    })

    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    var savedStay
    if (stay._id) {
        savedStay = await storageService.put(STORAGE_KEY, stay)
    } else {
        const stayToSave = {
            ...stay,
            host: userService.getLoggedinUser(),
            reviews: [],
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}