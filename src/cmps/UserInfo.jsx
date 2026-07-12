import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { reviewService } from '../services/review'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { SeeMoreModal } from '../cmps/SeeMoreModal.jsx'

export function UserInfo() {
    const [hostReviews, setHostReviews] = useState([])
    const [stayReviews, setStayReviews] = useState([])
    const [openModal, setOpenModal] = useState(null)

    const user = useSelector(storeState => storeState.userModule.user)
    const stays = useSelector(storeState => storeState.stayModule.stays)

    const loggedInUserId = user?._id || user?.id

    const safeStays = Array.isArray(stays) ? stays : []
    const myStays = safeStays.filter(stay => {
        const stayHostId = stay?.host?.id || stay?.host?._id
        return stayHostId && loggedInUserId && stayHostId === loggedInUserId
    })
    const isHost = !!myStays.length

    useEffect(() => {
        if (!loggedInUserId) return
        reviewService.query({ targetId: loggedInUserId, targetType: 'user' })
            .then(reviews => setHostReviews(reviews || []))
            .catch(err => console.error('Cannot load host reviews', err))
    }, [loggedInUserId])

    useEffect(() => {
        if (!myStays.length) return
        async function loadStayReviews() {
            try {
                const stayIds = myStays.map(stay => stay._id)
                const reviews = await reviewService.query({ stayIds })
                const stayIdSet = new Set(stayIds.map(id => id.toString()))
                const ownReviews = (reviews || []).filter(review =>
                    stayIdSet.has(review.targetId?.toString?.() || review.targetId)
                )
                setStayReviews(ownReviews)
            } catch (err) {
                console.error('Cannot load stay reviews', err)
            }
        }
        loadStayReviews()
    }, [myStays.length])

    if (!user) return <div>Loading profile...</div>
    console.log(user)
    const firstName = (user.fullname || '').trim().split(/\s+/)[0]

    return (
        <main className="user-info-main">
            <div className="profile-right-side">
                <h2 className="user-card-about">About me</h2>

                <section className="about-section">
                    <div className="user-private-card">
                        <section className="user-private-card-section">
                            <div className="user-private-card-mini-section">
                                <img src={user.imgUrl} className="user-card-avatar" alt={user.fullname} />
                                <div className="user-private-text-section">
                                    <span className="user-private-text-span">{user.fullname}</span>
                                    <span className="user-subtitle">{isHost ? 'Host' : 'Guest'}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                    <span className="about-user-card">{user.description}</span>
                </section>

                <section className="reviews-section">
                    {hostReviews.length > 0 && (
                        <section className="profile-reviews">
                            <h2 className="profile-reviews-title">What hosts are saying about {firstName}</h2>
                            <ReviewList reviews={hostReviews} variant="profile" withProfileLinks={false} />
                            <button className="reviews-show-all" onClick={() => setOpenModal('host')}>
                                Show all {hostReviews.length} reviews
                            </button>
                        </section>
                    )}
                    {isHost && stayReviews.length > 0 && (
                        <section className="profile-reviews">
                            <h2 className="profile-reviews-title">{firstName}'s Listings reviews</h2>
                            <ReviewList reviews={stayReviews} variant="profile" withProfileLinks={false} />
                            <button className="reviews-show-all" onClick={() => setOpenModal('stay')}>
                                Show all {stayReviews.length} reviews
                            </button>
                        </section>
                    )}
                </section>

                {openModal && (
                    <SeeMoreModal onClose={() => setOpenModal(null)}>
                        <h3 className="reviews-modal-count">
                            {(openModal === 'host' ? hostReviews : stayReviews).length} reviews
                        </h3>
                        <ReviewList
                            reviews={openModal === 'host' ? hostReviews : stayReviews}
                            variant="modal"
                            withProfileLinks={false}
                        />
                    </SeeMoreModal>
                )}
            </div>
        </main>
    )
}