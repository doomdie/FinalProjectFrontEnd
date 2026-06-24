import React, { useState } from 'react'
import { CustomCarousel } from './CustomCarousel'
import { SvgIcon } from '../services/svg.service.jsx'

import { StayCard } from './StayCard'


export function StayCarouselRow({ title, stays, filterFn, itemsPerSlide = 4 }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const actualFilter = filterFn || (() => true)
    const filteredStays = stays.filter(actualFilter)

    if (!filteredStays.length) return null

    const totalSlides = Math.ceil(filteredStays.length / itemsPerSlide)

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1))
    }

    return (
        <div className="carousel-row-wrapper">
            <header className="carouselHeader">
                <h2 className="carousel-title">
                    {title}
                    <span className="title-arrow"><SvgIcon iconName="titleArrow" /></span>
                </h2>
                <div className="carousel-buttons">
                    <button onClick={handlePrev} disabled={currentIndex === 0}>
                        <SvgIcon iconName="chevronLeft" />
                    </button>
                    <button onClick={handleNext} disabled={currentIndex === totalSlides - 1}>
                        <SvgIcon iconName="chevronRight" />
                    </button>
                </div>
            </header>
            <CustomCarousel
                itemsPerSlide={itemsPerSlide}
                selectedItem={currentIndex}
                onChange={setCurrentIndex}
            >
                {filteredStays.map(stay => (
                    <StayCard key={stay._id} stay={stay} />
                ))}
            </CustomCarousel>
        </div>
    )
}