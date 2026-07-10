import { httpService } from '../http.service'

export const reviewService = { add, query, remove }

function query(filterBy = {}) {
    const cleanFilterBy = Object.fromEntries(
        Object.entries(filterBy).filter(([_, v]) => v != null)
    )
    
    const searchParams = new URLSearchParams(cleanFilterBy)
    const url = `review?${searchParams.toString()}`
    
    console.log('DEBUG: Frontend calling URL:', url)
    return httpService.get(url)
}

async function remove(reviewId) {
    return await httpService.delete(`review/${reviewId}`)
}

async function add(review) {
    return await httpService.post('review', review)
}