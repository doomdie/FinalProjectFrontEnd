import { orderService as local } from './orders.service.local'
import { orderService as remote } from './orders.service.remote'

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const { VITE_LOCAL = 'false', DEV = false } = env

export const orderService = (VITE_LOCAL === 'true') ? local : remote

if (DEV && typeof window !== 'undefined') {
    window.orderService = orderService
}