
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    
}
window.cs = stayService


async function query(filterBy = { txt: '', minPrice: 0, startDate: '', endDate: ''}) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, minPrice, sortField, sortDir, startDate, endDate } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
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
    if(sortField === 'price'){
        stays.sort((stay1, stay2) => 
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }
    if(sortField === 'capacity'){
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
        _id,
        name,
        type,
        imgUrls,
        price,
        capacity,
        host,
        loc,
        labels,
        amenities,
        avgRating,
        reviewCount
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

async function save(stay) {
    var savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            price: stay.price
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            vendor: stay.vendor,
            price: stay.price,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

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