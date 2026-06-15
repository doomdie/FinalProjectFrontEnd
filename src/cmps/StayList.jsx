import React from 'react'
import { useSyncStayFilter } from '../customHooks/useSyncStayFilter'
import { StayCarouselRow } from '../cmps/StayCarouselRow'

export function StayList({ stays }) {
    useSyncStayFilter()

    if (!stays || !stays.length) return <section><h1>Loading stays...</h1></section>

    return (
        <section className="stay-list-container">
            
            <StayCarouselRow 
                title="Popular homes in Eilat" 
                stays={stays} 
                filterFn={(stay) => stay.type === 'Villa'}
            />

            <StayCarouselRow 
                title="Highest Rated Stays" 
                stays={stays} 
                 itemsPerSlide={1}

               filterFn={(stay) => stay.price < 120}
            />

        </section>
    )
}