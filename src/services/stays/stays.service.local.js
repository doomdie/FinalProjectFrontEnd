
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'
_createStays()
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
function _createStays() {
    let stays = JSON.parse(localStorage.getItem(STORAGE_KEY))
    
    if (!stays || !stays.length) {
        stays = [
            {
                _id: 's101',
                name: 'Ribeira Charming Duplex',
                type: 'House',
                imgUrls: ['https://e26e9b.jpg', 'otherImg.jpg'],
                price: 80.0,
                summary: 'Fantastic duplex apartment...',
                capacity: 8,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics'],
                labels: ['Top of the world', 'Trending', 'Play', 'Tropical'],
                host: {
                    _id: 'u101',
                    fullname: 'Davit Pok',
                    imgUrl: 'https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small',
                },
                loc: {
                    country: 'Portugal',
                    countryCode: 'PT',
                    city: 'Lisbon',
                    address: '17 Kombo st',
                    lat: -8.61308,
                    lng: 41.1413,
                },
                reviews: [
                    {
                        id: 'madeId',
                        txt: 'Very helpful hosts. Cooked traditional...',
                        rate: 4,
                        by: {
                            _id: 'u102',
                            fullname: 'user2',
                            imgUrl: '/img/img2.jpg',
                        },
                    },
                ],
                likedByUsers: ['mini-user'],
            }
        ]
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stays))
    }
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