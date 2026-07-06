import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders } from '../store/actions/order.actions'

export function PendingReservations() {
    const user = useSelector(storeState => storeState.userModule.user)
    const orders = useSelector(storeState => storeState.orderModule.hostOrders) || []

    useEffect(() => {
        if (!user?._id) return

        loadOrders({ hostId: user._id })

        function onTabFocus() {
            loadOrders({ hostId: user._id })
        }

        window.addEventListener('focus', onTabFocus)
        return () => {
            window.removeEventListener('focus', onTabFocus)
        }
    }, [user?._id])

    const today = new Date()

    const activeReservations = orders.filter(order => {
        const checkoutDate = new Date(order.endDate)
        return checkoutDate >= today
    })

    const completedReservations = orders.filter(order => {
        const checkoutDate = new Date(order.endDate)
        return checkoutDate < today
    })

    if (!orders.length) {
        return <main className="pending-main"><p>No reservations booked for your listings yet.</p></main>
    }

    return (
        <main className="pending-main">
            <h2>Active & Upcoming Reservations</h2>
            {!activeReservations.length ? (
                <p>No active or upcoming reservations.</p>
            ) : (
                <ul className="clean-list dashboard-orders-list">
                    {activeReservations.map(order => (
                        <li key={order._id} className="order-item upcoming">
                            <div className="order-details">
                                <p><strong>Stay:</strong> {order.stay.name}</p>
                                <p><strong>Guest:</strong> {order.buyer.fullname}</p>
                                <p><strong>Dates:</strong> {order.startDate} – {order.endDate}</p>
                                <p><strong>Total Earnings:</strong> ₪{order.totalPrice}</p>
                            </div>
                            <span className="trip-status-badge upcoming">Confirmed</span>
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Completed Reservations</h2>
            {!completedReservations.length ? (
                <p>No completed historic reservations yet.</p>
            ) : (
                <ul className="clean-list dashboard-orders-list">
                    {completedReservations.map(order => (
                        <li key={order._id} className="order-item completed">
                            <div className="order-details">
                                <p><strong>Stay:</strong> {order.stay.name}</p>
                                <p><strong>Guest:</strong> {order.buyer.fullname}</p>
                                <p><strong>Dates:</strong> {order.startDate} – {order.endDate}</p>
                                <p><strong>Total Earned:</strong> ₪{order.totalPrice}</p>
                            </div>
                            <span className="trip-status-badge completed">Finished</span>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}