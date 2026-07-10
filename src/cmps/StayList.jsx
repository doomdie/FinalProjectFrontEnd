import { StayCarouselRow } from '../cmps/StayCarouselRow.jsx'

const ROW_SIZE = 21
const CITY_ROWS = 4          // how many city rows to show
const MIN_STAYS_PER_CITY = 3 // skip cities with fewer stays than this
const CITY_ROW_TITLES = [
    city => `Stay in ${city}`,
    city => `Popular homes in ${city}`,
    city => `Guests also checked out ${city}`,
    city => `Available next month in ${city}`,
]

export function StayList({ stays, byCity = false }) {
    const safeStays = Array.isArray(stays) ? stays : []

    if (byCity) {
        // group stays by city
        const byCityMap = {}
        safeStays.forEach(stay => {
            const city = stay?.loc?.city
            if (!city) return
            if (!byCityMap[city]) byCityMap[city] = []
            byCityMap[city].push(stay)
        })

        // biggest cities first, keep only the ones with enough stays
        const cities = Object.keys(byCityMap)
            .filter(city => byCityMap[city].length >= MIN_STAYS_PER_CITY)
            .sort((a, b) => byCityMap[b].length - byCityMap[a].length)
            .slice(0, CITY_ROWS)

        return (
            <section className="stay-list-container">
                {cities.map((city, idx) => (
                    <StayCarouselRow
                        key={city}
                        title={CITY_ROW_TITLES[idx % CITY_ROW_TITLES.length](city)}
                        stays={[
                            ...byCityMap[city].slice(0, ROW_SIZE),
                            { isLinkCard: true, linkTo: `/search?search=${encodeURIComponent(city)}` }
                        ]}
                        itemsPerSlide={6}
                    />
                ))}
            </section>
        )
    }

    const sharedHomes = [
        ...safeStays.filter(s => s?.type === 'Shared homes').slice(0, ROW_SIZE),
        { isLinkCard: true, linkTo: '/search?type=Shared%20homes' }
    ]

    const budgetStays = [
        ...safeStays.filter(s => s?.price > 120).slice(0, ROW_SIZE),
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