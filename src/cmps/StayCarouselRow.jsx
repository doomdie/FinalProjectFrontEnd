import React, { useState } from 'react'
import { CustomCarousel } from './CustomCarousel'
import { StayCard } from './StayCard'

export function StayCarouselRow({ title, stays, filterFn, itemsPerSlide = 4 }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const actualFilter = filterFn || (() => true)
    const filteredStays = stays.filter(actualFilter)

    if (!filteredStays.length) return null

    const totalSlides = Math.ceil(filteredStays.length / itemsPerSlide)

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    }

    return (
        <div className="carousel-row-wrapper">
            <header className="carouselHeader">
                <h2>{title}</h2>
                <div className="carousel-buttons">
                    <button onClick={handlePrev}>L</button>
                    <button onClick={handleNext}>R</button>
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