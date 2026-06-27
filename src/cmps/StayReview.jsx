export function StayReview({ stay }) {
    if (!stay || !stay.reviews) return <div>Loading reviews...</div>
    console.log(stay)
    return (
        // <div>
        //     {stay.reviews[1]?.txt}
        //     <div>YOOOO</div>
        // </div>
        <div></div>
    )
}
