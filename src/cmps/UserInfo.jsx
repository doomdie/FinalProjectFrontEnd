import { useSelector } from 'react-redux'

export function UserInfo() {
    const user = useSelector(storeState => storeState.userModule.user)
    const stays = useSelector(storeState => storeState.stayModule.stays)

    const loggedInUserId = user?._id || user?.id

    const safeStays = Array.isArray(stays) ? stays : []

    const myStay = safeStays.find(stay => {
        const stayHostId = stay?.host?.id || stay?.host?._id
        return stayHostId && loggedInUserId && stayHostId === loggedInUserId
    })
    const isHost = !!myStay
    const hostAbout = myStay?.host?.about || ''

    if (!user) return <div>Loading profile...</div>

    return (
        <main className="user-info-main">
            <div className="profile-right-side">


                <section className="about-section">
                    <h2>About</h2>
                    <p className="about-text">Hello, my name is {user.fullname || user.fullName}</p>
                    {isHost && hostAbout && <p className="host-about-text">{hostAbout}</p>}
                </section>

                <section className="reviews-section">
                    <h2>⭐ Reviews Placeholder</h2>
                </section>
            </div>
        </main>
    )
}