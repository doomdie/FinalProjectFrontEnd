import React from 'react'
import { StayCarouselRow } from '../cmps/StayCarouselRow.jsx'

export function StayList({ stays }) {
    if (!stays || !stays.length) return <section><h1>Loading stays...</h1></section>

    const sharedHomes = [
        ...stays.filter(s => s.type === 'Shared homes').slice(0, 7),
        { isLinkCard: true, linkTo: '/search?type=Shared%20homes' }
    ]

    const budgetStays = [
        ...stays.filter(s => s.price < 120).slice(0, 7),
        { isLinkCard: true, linkTo: '/search?maxPrice=120' }
    ]

    const allStays = [
        ...stays.slice(0, 7),
        { isLinkCard: true, linkTo: '/search' }
    ]

    const newestStays = [
        ...[...stays].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 7),
        { isLinkCard: true, linkTo: '/search?sort=newest' }
    ]

    return (
        <section className="stay-list-container">
            <StayCarouselRow title="Popular shared homes" stays={sharedHomes} itemsPerSlide={6} />
            <StayCarouselRow title="Highest rated stays" stays={budgetStays} itemsPerSlide={6} />
            <StayCarouselRow title="All stays" stays={allStays} itemsPerSlide={6} />
            <StayCarouselRow title="Newest stays" stays={newestStays} itemsPerSlide={6} />
        </section>
    )
}