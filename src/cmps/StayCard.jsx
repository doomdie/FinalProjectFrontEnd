export function StayCard({ stay }) {
    const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    const displayImg = stay.imgUrls && stay.imgUrls.length ? stay.imgUrls[0] : fallbackImage

    return (
        <div className="stay-card">
            <div className="stay-card-img-wrapper">
                <img 
                    src={displayImg} 
                    alt={stay.name} 
                    className="stay-card-img" 
                />
            </div>
            <div className="stay-card-content">
                <h2>{stay.name}</h2>
                <p className="stay-type">Type: {stay.type}</p>
                <p className="stay-location">Location: {stay.loc.city}, {stay.loc.country}</p>
                <p className="stay-price"><strong>${stay.price}</strong> / night</p>
            </div>
        </div>
    )
}