import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadOrders } from '../store/actions/order.actions'
import { StayCard } from '../cmps/StayCard.jsx'

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
        <section className="host-listings-page"
        > <header className="hosting-menu-header">
                <span className = "hosting-menu-header-text">Reservations</span>
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
            </header>


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
                <ul className="host-dashboard-grid">
                    {shownOrders.map(order => (
                        <li key={order._id} className={`order-card ${isShowingPast ? 'past' : ''}`}>
                            <StayCard stay={{ ...order.stay, imgUrls: order.imgUrl ? [order.imgUrl] : order.stay.imgUrls }}>
                                <h2 className="stay-card-title">{order.stay.name}</h2>
                                <p className="stay-card-dates">Hosting {order.buyer.fullname}</p>
                                <p className="stay-card-dates">{order.startDate} – {order.endDate}</p>
                                <p className="stay-card-price">₪{Number(order.totalPrice).toLocaleString()}</p>
                            </StayCard>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}