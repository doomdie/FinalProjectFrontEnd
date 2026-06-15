const stayImgs = [
    '/img/stay1.jpeg',
    '/img/stay2.jpeg',
    '/img/stay3.jpeg',
    '/img/stay4.jpeg',
    '/img/stay5.jpeg',
    '/img/stay6.jpeg',
    '/img/stay7.jpeg',
    '/img/stay8.jpeg',
]

export function HomesPage() {
    return (
        <section className="homes-page">
            <h2 className="section-title">Popular homes</h2>

            <ul className="stay-list">
                {stayImgs.map(imgUrl => (
                    <li key={imgUrl} className="stay-card">
                        <img src={imgUrl} alt="stay" />
                    </li>
                ))}
            </ul>
            
        </section>
    )
}