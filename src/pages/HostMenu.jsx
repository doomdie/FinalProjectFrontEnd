import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'

import myLocalImage from '../data/image.avif'; // Where the heck do i put the image folder professionally again like.. Remember to ask boris!! Or the teacher

export function HostMenu() {
    return (
        <div className="host-reservations">
            <div className ="image-flex-wrapper">
            <img src={myLocalImage} alt="Host reservation" />
            </div>
            <h1>You don't have any reservations</h1>
            <h2>To get booked, you'll need to complete and publish your listing.</h2>
            <NavLink to="/become-a-host">
						hostmode
					</NavLink>
        </div>
    );
}