import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadOrders } from '../store/actions/order.actions'

import myLocalImage from '../data/image.avif'

export function HostMenu() {
    const user = useSelector(storeState => storeState.userModule.user)
    const hostOrders = useSelector(storeState => storeState.orderModule.hostOrders) || []
    const [isShowingPast, setIsShowingPast] = useState(false)

    useEffect(() => {
        if (user) loadOrders({ hostId: user._id })
    }, [user])

    if (!user) {
        return (
            <div className="tab-content">
                <div className="host-reservations">
                    <h1>Please log in to access.</h1>
                </div>
            </div>
        )
    }

    const today = new Date().toISOString().split('T')[0]
    const upcomingOrders = hostOrders.filter(order => order.endDate >= today)
    const pastOrders = hostOrders.filter(order => order.endDate < today)
    const shownOrders = isShowingPast ? pastOrders : upcomingOrders

    return (
        <div className="tabby-content">
            <div className="orders-toggle">
                <button
                    className={!isShowingPast ? 'active' : ''}
                    onClick={() => setIsShowingPast(false)}
                >
                    Upcoming ({upcomingOrders.length})
                </button>
                <button
                    className={isShowingPast ? 'active' : ''}
                    onClick={() => setIsShowingPast(true)}
                >
                    Past ({pastOrders.length})
                </button>
            </div>

            {!shownOrders.length ? (
                <div className="host-reservations">
                    <div className="image-flex-wrapper">
                        <img src={myLocalImage} alt="Host reservation" />
                    </div>
                    <h1>{isShowingPast ? 'No past reservations yet' : "You don't have any reservations"}</h1>
                    {!isShowingPast && (
                        <>
                            <h2>To get booked, you'll need to complete and publish your listing.</h2>
                            <NavLink to="/become-a-host" className="host-mode-link">
                                Complete your listing
                            </NavLink>
                        </>
                    )}
                </div>
            ) : (
                <ul className="orders-grid">
                    {shownOrders.map(order => (
                        <li key={order._id} className={`order-card ${isShowingPast ? 'past' : ''}`}>
                            <div className="order-card-img-wrapper">
                                {order.imgUrl
                                    ? <img src={order.imgUrl} alt={order.stay.name} />
                                    : <div className="order-card-img-fallback" />}
                                <span className="order-dates-badge">{order.startDate} – {order.endDate}</span>
                            </div>
                            <div className="order-card-body">
                                <p className="order-stay-name">{order.stay.name}</p>
                                <p className="order-guest">Hosting {order.buyer.fullname}</p>
                                <p className="order-total">₪{order.totalPrice}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}