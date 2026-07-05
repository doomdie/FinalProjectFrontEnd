// wishlist — liked stay ids, persisted in localStorage so hearts survive refresh
const STORAGE_KEY = 'wishlist'

export const wishlistService = {
    getLikedIds,
    isLiked,
    toggleLike,
}

function getLikedIds() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

function isLiked(stayId) {
    return getLikedIds().includes(stayId)
}

function toggleLike(stayId) {
    const likedIds = getLikedIds()
    const updated = likedIds.includes(stayId)
        ? likedIds.filter(id => id !== stayId)
        : [...likedIds, stayId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
}