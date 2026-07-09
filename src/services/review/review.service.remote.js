import { httpService } from '../http.service'

export const reviewService = {
	add,
	query,
	remove,
}

// function query(filterBy) {
// 	var queryStr = !filterBy ? '' : `?name=${filterBy.name}&sort=anaAref`
// 	return httpService.get(`review${queryStr}`)
// }
function query(filterBy = {}) {
    const params = new URLSearchParams()
    
    if (filterBy.targetId) params.append('targetId', filterBy.targetId)
    if (filterBy.targetType) params.append('targetType', filterBy.targetType)
    if (filterBy.byUserId) params.append('byUserId', filterBy.byUserId)

    const queryStr = params.toString() ? `?${params.toString()}` : ''
    return httpService.get(`review${queryStr}`)
}

async function remove(reviewId) {
	await httpService.delete(`review/${reviewId}`)
}

async function add({ txt, aboutUserId }) {
	return await httpService.post(`review`, { txt, aboutUserId })
}