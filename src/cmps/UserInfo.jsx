import { useSelector } from 'react-redux'

export function UserInfo() {
    const user = useSelector(storeState => storeState.userModule.user)
    console.log(user)

    const stays = useSelector(storeState => storeState.stayModule.stays)

    const loggedInUserId = user?._id || user?.id

    const safeStays = Array.isArray(stays) ? stays : []

    const myStay = safeStays.find(stay => {
        const stayHostId = stay?.host?.id || stay?.host?._id
        return stayHostId && loggedInUserId && stayHostId === loggedInUserId
    })
    const isHost = !!myStay

    if (!user) return <div>Loading profile...</div>
    // My variable names are really bad Apologies in advance will hopefully fix later
    return (
        <main className="user-info-main">
            <div className="profile-right-side">

                <h2 className="user-card-about">About me</h2>

                <section className="about-section">

                    <div className="user-private-card">
                        <section className="user-private-card-section">
                            <div className="user-private-card-mini-section">  <img src={user.imgUrl} className="user-card-avatar" />

                                <div className="user-private-text-section">
                                    <span className="user-private-text-span">{user.fullname}</span><span className="user-subtitle">
                                        {isHost ? 'Host' : 'Guest'}
                                    </span></div>
                            </div>
                        </section>

                    </div>
                    <span className ="about-user-card">Placeholder</span>


                </section>

                <section className="reviews-section">
                    <h2>⭐ Reviews Placeholder</h2>
                </section>
            </div>
        </main>
    )
}