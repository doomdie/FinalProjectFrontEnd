// wishlist — liked stay ids in localStorage, so hearts show instantly on load
const STORAGE_KEY = 'wishlist'

export const wishlistService = {
    getLikedIds,
    setLiked,
    setAll,
}

function getLikedIds() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

function setLiked(stayId, isLiked) {
    const likedIds = getLikedIds()
    const updated = isLiked
        ? [...new Set([...likedIds, stayId])]
        : likedIds.filter(id => id !== stayId)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
}

function setAll(likedIds) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds))
    return likedIds
}