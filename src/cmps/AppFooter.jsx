export function AppFooter() {
    const footerColumns = [
        {
            title: 'Support',
            links: ['Help Center', 'Get help with a safety issue', 'OurCover', 'Travel insurance', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report neighborhood concern'],
        },
        {
            title: 'Hosting',
            links: ['Ourbnb your home', 'Ourbnb your experience', 'Ourbnb your service', 'OurCover for Hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly', 'Ourbnb-friendly apartments', 'Join a free hosting class', 'Find a co-host', 'Refer a host'],
        },
        {
            title: 'Ourbnb',
            links: ['2026 Summer Release', 'Newsroom', 'Careers', 'Investors', 'Gift cards', 'Ourbnb.org emergency stays'],
        },
    ]

    return (
        <footer className="app-footer full">
            <div className="footer-columns">
                {footerColumns.map(column => (
                    <div className="footer-column" key={column.title}>
                        <h3 className="footer-col-title">{column.title}</h3>
                        <ul>
                            {column.links.map(link => (
                                <li key={link}><a className="footer-link">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="footer-bottom">
                <span>© 2026 Ourbnb, Inc. · Privacy · Terms · Your Privacy Choices</span>
                <span className="footer-locale">🌐 English (US) · ₪ ILS</span>
            </div>
        </footer>
    )
}