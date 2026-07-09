import React from 'react'
import { StayCarouselRow } from '../cmps/StayCarouselRow.jsx'

export function StayList({ stays }) {

    const ROW_SIZE = 21   

    const safeStays = Array.isArray(stays) ? stays : []

    const sharedHomes = [
        ...safeStays.filter(s => s?.type === 'Shared homes').slice(0, ROW_SIZE),
        { isLinkCard: true, linkTo: '/search?type=Shared%20homes' }
    ]
    const budgetStays = [
    ...safeStays.filter(s => s?.price < 120).slice(0, ROW_SIZE),
    { isLinkCard: true, linkTo: '/search?maxPrice=120' }
]

const allStays = [
    ...safeStays.slice(0, ROW_SIZE),
    { isLinkCard: true, linkTo: '/search' }
]

const newestStays = [
    ...[...safeStays].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)).slice(0, ROW_SIZE),
    { isLinkCard: true, linkTo: '/search?sort=newest' }
]

    return (
        <section className="stay-list-container">
            <StayCarouselRow title="Popular shared homes" stays={sharedHomes} itemsPerSlide={7} />
            <StayCarouselRow title="Highest rated stays" stays={budgetStays} itemsPerSlide={6} />
            <StayCarouselRow title="All stays" stays={allStays} itemsPerSlide={6} />
            <StayCarouselRow title="Newest stays" stays={newestStays} itemsPerSlide={6} />
        </section>
    )
}