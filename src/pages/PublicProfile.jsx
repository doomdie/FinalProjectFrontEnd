import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StayMiniList } from '../cmps/StayMiniList'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { loadStays, removeStay } from '../store/actions/stay.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user'
import { reviewService } from '../services/review'
import { loadOrders } from '../store/actions/order.actions'
import { loadHostStays } from '../store/actions/stay.actions'

export function PublicProfile() {
  const { id } = useParams()
  const [displayedUser, setDisplayedUser] = useState(null)
  const [userReviews, setUserReviews] = useState([])
  const [stayReviews, setStayReviews] = useState([])
  const [hostReviews, setHostReviews] = useState([])
  const trips = useSelector(storeState => storeState.orderModule.guestOrders) || []
  const hostStays = useSelector(storeState => storeState.stayModule.hostStays) || []
  console.log('profile id:', id)
  console.log('hostStays owners:', hostStays.map(s => `${s.name} → ${s.host?._id}`))
  useEffect(() => {
    async function loadUser() {
      try {
        const fetchedUser = await userService.getById(id)
        setDisplayedUser(fetchedUser)
        // loadStays({ byUserId: id })
        loadHostStays(id)
        loadOrders({ buyerId: id })
        const [written, received] = await Promise.all([
          reviewService.query({ byUserId: id }),
          reviewService.query({ targetId: id, targetType: 'user' }),
        ])
        setUserReviews(written || [])
        setHostReviews(received || [])
      } catch (err) {
        showErrorMsg('Cannot load user profile')
      }
    }
    if (id) loadUser()
  }, [id])
  useEffect(() => {
    if (!hostStays.length) return
    async function loadStayReviews() {
      try {
        const stayIds = hostStays.map(stay => stay._id)
        const reviews = await reviewService.query({ stayIds })
        const stayIdSet = new Set(stayIds)
        const ownReviews = (reviews || []).filter(review =>
          stayIdSet.has(review.targetId?.toString?.() || review.targetId)
        )
        setStayReviews(ownReviews)
        console.log('stayIds:', stayIds)
        console.log('sample targetId:', reviews?.[0]?.targetId, typeof reviews?.[0]?.targetId)
        console.log('kept:', ownReviews.length, 'of', reviews?.length)
      } catch (err) {
        console.error('Cannot load stay reviews', err)
      }
    }
    loadStayReviews()
  }, [hostStays])
  async function onRemoveStay(stayId) {
    try {
      await removeStay(stayId)
      showSuccessMsg('Stay removed')
    } catch (err) {
      showErrorMsg('Cannot remove')
    }
  }

  if (!displayedUser) return <p>Loading...</p>
  if (displayedUser.isHost) console.log("YO")
  const yearsOnPlatform = displayedUser.createdAt
    ? Math.max(1, new Date().getFullYear() - new Date(displayedUser.createdAt).getFullYear())
    : 1

  const firstName = (displayedUser.fullname || '').trim().split(/\s+/)[0]
  return (
    <section className="public-profile">
      <header className="profile-header">
        <div className="user-card">
          <header className="usercard-header">
            <img src={displayedUser.imgUrl} alt={displayedUser.fullname} className="profile-avatar" />
            <div className="usercard-text">
              <span className="usercard-text-one">{firstName}</span>
              <span className="usercard-text-two">{displayedUser.isHost ? 'Host' : 'Guest'}</span>
            </div>
          </header>
          <div className="usercard-info">
            <div className="usercard-info-card one">
              <span className="usercard-card-header">{trips.length}</span>
              <span className="usercard-card-bottom">Trips</span>
            </div>
            <div className="usercard-info-card two">
              <span className="usercard-card-header">{userReviews.length}</span>
              <span className="usercard-card-bottom">Reviews</span>
            </div>
            <div className="usercard-info-card three">
              <span className="usercard-card-header">{yearsOnPlatform}</span>
              <span className="usercard-card-bottom">Years on Airbnb</span>
            </div>
          </div>
        </div>
        <div className="user-paragraph-two"><span className="aboutcard one"> About {firstName}</span><span className="aboutcard two">Valued User</span></div>
      </header>
      <div className="footer-placeholder" />
      {hostReviews.length > 0 && (
        <section className="profile-reviews">
          <h2 className="profile-reviews-title">What hosts are saying about {displayedUser.fullname}</h2>
          <ReviewList reviews={hostReviews} variant="profile" withProfileLinks={false} />
          <button className="reviews-show-all">Show all {hostReviews.length} reviews</button>
        </section>
      )}
      {displayedUser.isHost && stayReviews.length > 0 && (
        <section className="profile-reviews">
          <h2 className="profile-reviews-title">{firstName}'s stays reviews</h2>
          <ReviewList reviews={stayReviews} variant="profile" withProfileLinks={false} />
        </section>
      )}
    </section>
  )
}