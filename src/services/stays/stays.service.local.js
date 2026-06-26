
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'
import gDefaultStays from './stay.json'
const STORAGE_KEY = 'stay'
_createStays()
export const stayService = {
    query,
    getById,
    save,
    remove,
    save,

}
window.cs = stayService


async function query(filterBy = { txt: '', minPrice: 0, startDate: '', endDate: '' }) {
    console.log('Incoming filterBy parameter:', filterBy)
    var stays = await storageService.query(STORAGE_KEY)
    const { minPrice, sortField, sortDir, startDate, endDate, byUserId } = filterBy

    const txt = filterBy.txt || filterBy.search

    if (byUserId) {
        stays = stays.filter(stay => stay.host?.id === byUserId || stay.host?._id === byUserId || stay.byUser?._id === byUserId)
    }
    if (txt) {
        const regex = new RegExp(txt, 'i')
        stays = stays.filter(stay => regex.test(stay.loc.country) || regex.test(stay.loc.city))
    }
    if (minPrice) {
        stays = stays.filter(stay => stay.price >= minPrice)
    }
    if (startDate && endDate) {
        stays = stays.filter(stay => _isStayAvailable(stay, startDate, endDate))
    }
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
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}
function _createStays() {
    let stays = JSON.parse(localStorage.getItem(STORAGE_KEY))
    console.log("sup 1")

    if (!stays || !stays.length) {
        console.log("sup - local storage empty, seeding from JSON")
        stays = gDefaultStays

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stays))
    }
}
async function save(stay) {
    let savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            name: stay.name,
            type: stay.type,
            imgUrls: stay.imgUrls || [],
            price: stay.price,
            summary: stay.summary,
            capacity: stay.capacity,
            amenities: stay.amenities || [],
            labels: stay.labels || [],
            host: stay.host,
            loc: stay.loc,
            reviews: stay.reviews || [],
            likedByUsers: stay.likedByUsers || []
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            name: "Cozy Vacation Home",
            type: stay.type,
            imgUrls: stay.imgUrls || [],
            price: stay.price,
            summary: stay.summary,
            capacity: stay.capacity,
            amenities: stay.amenities || [],
            labels: stay.labels || [],
            host: {
                _id: "u101",
                fullname: "Davit Pok",
                imgUrl: "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg"
            },
            loc: {
                country: stay.loc?.country || '',
                countryCode: stay.loc?.countryCode || '',
                city: stay.loc?.city || '',
                address: stay.loc?.address || '',
                lat: stay.loc?.lat || 0,
                lng: stay.loc?.lng || 0
            },
            reviews: [],
            likedByUsers: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}
//_id,
// name,
// type,
// imgUrls,
// price,
// capacity,
// host,
// loc,
// labels,
// amenities,
// avgRating,
// reviewCount
// async function addStayMsg(stayId, txt) {
//     // Later, this is all done by the backend
//     const stay = await getById(stayId)

//     const msg = {
//         id: makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     stay.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, stay)

//     return msg
// }