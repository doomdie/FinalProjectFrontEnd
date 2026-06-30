import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'
import { StayMiniList } from '../cmps/StayMiniList'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders, saveOrder } from '../store/actions/order.actions'

import myLocalImage from '../data/image.avif'; // Where the heck do i put the image folder professionally again like.. Remember to ask boris!! Or the teacher

export function HostMenu() {
    const user = useSelector(storeState => storeState.userModule.user)
    const orders = useSelector(storeState => storeState.orderModule.orders)
    if (!user) {
        return (
            <div className="tab-content">
                <div className="host-reservations">
                    <h1>Please log in to view your hosting dashboard.</h1>
                </div>
            </div>
        )   
    }
    const approvedOrders = orders.filter(order => 
        order.status === 'approved' && order.hostId === user._id
    )
    return (
        <div className="tab-content">
            {!approvedOrders.length ? (
                <div className="host-reservations">
                    <div className="image-flex-wrapper">
                        <img src={myLocalImage} alt="Host reservation" />
                    </div>
                    <h1>You don't have any reservations</h1>
                    <h2>To get booked, you'll need to complete and publish your listing.</h2>
                    <NavLink to="/become-a-host" className="host-mode-link">
                        Complete your listing
                    </NavLink>
                </div>
            ) : (
                <ul className="clean-list dashboard-orders-list">
                    {approvedOrders.map(order => (
                        <li key={order._id} className="order-item approved">
                            <div className="order-details">
                                <p><span>Stay:</span> {order.stay.name} </p>
                                <p><span>Guest:</span> {order.buyer.fullname}</p>
                                <p><span>Dates:</span> {order.startDate} – {order.endDate}</p>
                                <p><span>Total:</span> ₪{order.totalPrice}</p>
                            </div>
                            <div className="order-status-badge approved">✓ Accepted</div>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}