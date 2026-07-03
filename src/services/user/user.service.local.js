import { storageService } from '../async-storage.service'
import initialUsers from './users.json'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
_initUsers()
export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
}
async function _initUsers() {
    const localData = localStorage.getItem('user')
    
    if (!localData || localData === '[]') {
        console.log('Seeding users from user.json...')
        
        localStorage.setItem('user', JSON.stringify(initialUsers))
        
        console.log('Successfully loaded users from user.json with correct IDs!')
    }
}

async function getUsers() {
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}
// async function getById(userId) {
//     try {
//         const user = await storageService.get('user', userId)
//         if (user) return user
//     } catch (err) {
//         const user = initialUsers.find(u => (u._id === userId || u.id === userId))
        
//         if (user) {
            
//             return user
//         }
//     }

    // Ultimate fallback if it doesn't exist anywhere
  


function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id, score }) {
    const user = await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)

    const loggedinUser = getLoggedinUser()
    if (loggedinUser?._id === user._id) saveLoggedinUser(user)

    return user
}
async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username && user.password === userCred.password)

    if (user) return saveLoggedinUser(user)
    throw new Error('Invalid username or password')
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminsky',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        score: 10000,
    }

    const newUser = await storageService.post('user', user)
    console.log('newUser: ', newUser)
}