
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
            console.log("sup 1")

    if (!stays || !stays.length) {
        console.log("sup")
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
            },
            {
                _id: 's102',
                name: 'Sunset Beachfront Villa',
                type: 'Villa',
                imgUrls: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef', 'villa-inside.jpg'],
                price: 250.0,
                summary: 'Stunning luxury villa right on the white sands. Enjoy private pool access and panoramic ocean views.',
                capacity: 6,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Air conditioning', 'Pool', 'Ocean view', 'Gym'],
                labels: ['Beachfront', 'Trending', 'Luxury', 'Islands'],
                host: {
                    _id: 'u103',
                    fullname: 'Elena Rostova',
                    imgUrl: 'https://a0.muscache.com/im/pictures/user/avatar1.jpg',
                },
                loc: {
                    country: 'Greece',
                    countryCode: 'GR',
                    city: 'Mykonos',
                    address: '42 Thalassa Way',
                    lat: 37.4467,
                    lng: 25.3289,
                },
                reviews: [
                    {
                        id: 'r201',
                        txt: 'An absolute paradise! Watching the sunset from the pool was unforgettable.',
                        rate: 5,
                        by: {
                            _id: 'u104',
                            fullname: 'John Doe',
                            imgUrl: '/img/u104.jpg',
                        },
                    },
                ],
                likedByUsers: ['mini-user', 'travel-guru'],
            },
            {
                _id: 's103',
                name: 'Cozy A-Frame Mountain Cabin',
                type: 'Cabin',
                imgUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739', 'cabin-snow.jpg'],
                price: 145.0,
                summary: 'Escape to the woods in this rustic yet modern A-frame cabin. Perfect for ski season or hiking.',
                capacity: 4,
                amenities: ['Wifi', 'Indoor fireplace', 'Kitchen', 'Heating', 'Mountain view', 'Pets allowed'],
                labels: ['National parks', 'Off-the-grid', 'Trending'],
                host: {
                    _id: 'u105',
                    fullname: 'Marc Dubois',
                    imgUrl: 'https://a0.muscache.com/im/pictures/user/avatar2.jpg',
                },
                loc: {
                    country: 'France',
                    countryCode: 'FR',
                    city: 'Chamonix',
                    address: '88 Rue des Sapins',
                    lat: 45.9227,
                    lng: 6.8685,
                },
                reviews: [
                    {
                        id: 'r301',
                        txt: 'Super cozy. The fireplace was amazing after a long day of skiing.',
                        rate: 5,
                        by: {
                            _id: 'u106',
                            fullname: 'Sarah Smith',
                            imgUrl: '/img/u106.jpg',
                        },
                    },
                ],
                likedByUsers: [],
            },
            {
                _id: 's104',
                name: 'Industrial Minimalist Loft',
                type: 'Apartment',
                imgUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'loft-bed.jpg'],
                price: 110.0,
                summary: 'Sleek, high-ceiling loft in the heart of the design district. Steps away from top restaurants and cafes.',
                capacity: 2,
                amenities: ['TV', 'Wifi', 'Kitchen', 'Elevator', 'Washing machine', 'Dedicated workspace'],
                labels: ['Iconic cities', 'Design', 'Play'],
                host: {
                    _id: 'u107',
                    fullname: 'Kenji Sato',
                    imgUrl: 'https://a0.muscache.com/im/pictures/user/avatar3.jpg',
                },
                loc: {
                    country: 'Japan',
                    countryCode: 'JP',
                    city: 'Tokyo',
                    address: '3-Chome Shibuya',
                    lat: 35.6580,
                    lng: 139.7016,
                },
                reviews: [
                    {
                        id: 'r401',
                        txt: 'Very clean, ultra-modern, and incredibly close to the train station.',
                        rate: 4,
                        by: {
                            _id: 'u108',
                            fullname: 'Alex P.',
                            imgUrl: '/img/u108.jpg',
                        },
                    },
                ],
                likedByUsers: ['backpacker_99'],
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