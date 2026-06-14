export function StayList({ stays }) {
    
    if (!stays || !stays.length) return <section><h1>Loading stays...</h1></section>

    return (
        <section className="stay-list-container">
            {stays.map(stay => (
                <div key={stay._id} className="stay-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h2>{stay.name}</h2>
                    <p>Type: {stay.type}</p>
                    <p>Price: ${stay.price} / night</p>
                    <p>Location: {stay.loc.city}, {stay.loc.country}</p>
                </div>
            ))}
        </section>
    )
}