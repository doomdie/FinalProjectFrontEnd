import React from 'react'
import { CustomCarousel } from './CustomCarousel'
import { StayCard } from './StayCard'

export function StayCarouselRow({ title, stays, filterFn, itemsPerSlide = 4 }) {
    const actualFilter = filterFn || (() => true)
    const filteredStays = stays.filter(actualFilter)

    if (!filteredStays.length) return null

    return (
        <div className="carousel-row-wrapper">
            <h2>{title}</h2>
            <CustomCarousel itemsPerSlide={itemsPerSlide}>
                {filteredStays.map(stay => (
                    <StayCard key={stay._id} stay={stay} />
                ))}
            </CustomCarousel>
        </div>
    )
}