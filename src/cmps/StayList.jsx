import React from 'react'
// import { useSyncStayFilter } from '../customHooks/useSyncStayFilter'
import { StayCarouselRow } from '../cmps/StayCarouselRow.jsx'
export function StayList({ stays }) {


    // if (!stays || !stays.length) return <section><h1>Loading stays...</h1></section>

    return (
        <section className="stay-list-container">
            
            <StayCarouselRow
                title="Popular homes in Eilat"
                stays={stays}
                filterFn={(stay) => stay.type === 'Villa'}
            />

            <StayCarouselRow
                title="Highest rated stays"
                stays={stays}
                itemsPerSlide={7}

                filterFn={(stay) => stay.price < 120}
            />
            <StayCarouselRow
                title="All stays"
                stays={stays}
                itemsPerSlide={7}


            />
            <StayCarouselRow
                title="Newest stays"
                stays={[...stays].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
                itemsPerSlide={7}
            />

        </section>
    )
}