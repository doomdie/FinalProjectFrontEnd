import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomCarousel } from './CustomCarousel'
import { StayCard } from './StayCard'

export function StayCarouselRow({ title, stays, filterFn, itemsPerSlide = 6, linkTo }) {
    const navigate = useNavigate()

    const filteredStays = stays.filter(stay => {
        if (stay.isLinkCard) return true
        return filterFn ? filterFn(stay) : true
    })

    if (!filteredStays.length) return null
    const rowLink = linkTo || stays.find(s => s.isLinkCard)?.linkTo
    return (
        <div className="carousel-row-wrapper">
            <CustomCarousel title={title} linkTo={rowLink}>
                {filteredStays.map((stay, idx) => {
                    if (stay.isLinkCard) {
                        return (
                            <div
                                key="see-all"
                                className="stay-card see-all-card"
                                onClick={() => navigate(stay.linkTo)}
                            >
                                <div className="see-all-image-stack">
                                    <img src={filteredStays[2]?.imgUrls?.[0] || filteredStays[0]?.imgUrls?.[0]} alt="" className="stack-img img-back" />
                                    <img src={filteredStays[1]?.imgUrls?.[0] || filteredStays[0]?.imgUrls?.[0]} alt="" className="stack-img img-right" />
                                    <img src={filteredStays[0]?.imgUrls?.[0]} alt="" className="stack-img img-front" />
                                </div>
                                <div className="see-all-text">See all</div>
                            </div>
                        )
                    }
                    return <StayCard key={stay._id || idx} stay={stay} />
                })}
            </CustomCarousel>
        </div>
    )
}