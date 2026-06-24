import React from 'react';
import myLocalImage from '../data/image.avif'; // Where the heck do i put the image folder professionally again like.. Remember to ask boris!! Or the teacher

export function HostMenu() {
    return (
        <div className="host-reservations">
            <div className ="image-flex-wrapper">
            <img src={myLocalImage} alt="Host reservation" />
            </div>
            <h1>You don't have any reservations</h1>
            
        </div>
    );
}