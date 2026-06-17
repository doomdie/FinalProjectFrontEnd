import { Link } from 'react-router-dom'
export function StayCard({ stay }) {
    // --- YAIR'S VERSION ---
    const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    const displayImg = stay.imgUrls && stay.imgUrls.length ? stay.imgUrls[0] : fallbackImage

    // --- BORIS' LOCAL IMAGES ---
    // const myImgs = ['/img/stay1.jpeg', '/img/stay2.jpeg', '/img/stay3.jpeg', '/img/stay4.jpeg', '/img/stay5.jpeg', '/img/stay6.jpeg', '/img/stay7.jpeg', '/img/stay8.jpeg']
    // const displayImg = myImgs[Math.floor(Math.random() * myImgs.length)]

    return (
        <Link to={`/homes/${stay._id}`} className="stay-card">
            <div className="stay-card">
                <div className="stay-card-img-wrapper">
                    <img
                        src={displayImg}
                        alt={stay.name}
                        className="stay-card-img"
                        loading="lazy"
                    />
                </div>
                <div className="stay-card-content">
                    <h2>{stay.name}</h2>
                    <p className="stay-type">Type: {stay.type}</p>
                    <p className="stay-location">Location: {stay.loc.city}, {stay.loc.country}</p>
                    <p className="stay-price"><strong>${stay.price}</strong> / night</p>
                </div>
            </div>
        </Link>
    )
}