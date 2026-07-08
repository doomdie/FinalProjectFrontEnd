import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UserInfo } from '../cmps/UserInfo'
import { StayMiniList } from '../cmps/StayMiniList'
import { PastTrips } from '../cmps/PastTrips'
import { PendingReservations } from '../cmps/PendingReservations'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadStays, removeStay } from '../store/actions/stay.actions'
import { loadOrders } from '../store/actions/order.actions'
import {WishlistPage} from '../pages/WishlistPage'

export function UserDetails() {
  const user = useSelector(storeState => storeState.userModule.user)
  const stays = useSelector(storeState => storeState.stayModule.stays)

  const guestOrders = useSelector(storeState => storeState.orderModule.guestOrders) || []
  const navigate = useNavigate()

  const userId = user?._id || user?.id

  // const hostStays = Array.isArray(stays) ? stays.filter(stay => {
  //   return stay.host?._id === userId || stay.host?.id === userId
  // }) : []

  // const isUserHost = hostStays.length > 0
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (!user) {
      navigate('/')
      showErrorMsg('Please sign in first')
      return
    }

    loadStays({ byUserId: userId })
    loadOrders({ buyerId: userId })
  }, [user])

  async function onRemoveStay(stayId) {
    try {
      await removeStay(stayId)
      showSuccessMsg('Stay removed')
    } catch (err) {
      showErrorMsg('Cannot remove')
    }
  }

  if (!user) return null

  const now = new Date()



  const pastTrips = guestOrders ? guestOrders.filter(order => {
    const orderBuyerId = order.buyer?._id?.toString() || order.buyer?.id?.toString()
    const currentUserId = userId?.toString()
    const isBuyer = orderBuyerId === currentUserId

    const todayMidnight = new Date()
    todayMidnight.setHours(0, 0, 0, 0)

    const tripEndDate = order.endDate ? new Date(order.endDate) : null
    if (tripEndDate) tripEndDate.setHours(0, 0, 0, 0)

    const isPast = tripEndDate && tripEndDate < todayMidnight

    return isBuyer && isPast
  }) : []

  return (
    <section className="user-details-full">
      <aside className="user-aside">
        <div className="aside-organizer">
          <h3 className="user-profile-title">Profile</h3>
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            My Details
          </button>

          {/* {isUserHost && (
            <>
              <button
                className={`tab-btn ${activeTab === 'stays' ? 'active' : ''}`}
                onClick={() => setActiveTab('stays')}
              >
                My Stays
              </button>
              <button
                className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Reservations Center
              </button>
            </>
          )} */}

          <button
            className={`tab-btn ${activeTab === 'past-trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('past-trips')}
          >
            Past Trips
          </button>

          <button
            className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlisted Stays
          </button>
        </div>
      </aside>

      {activeTab === 'details' && (
        <UserInfo></UserInfo>
      )}

      {activeTab === 'past-trips' && (
        <PastTrips trips={pastTrips}></PastTrips>
      )}
      
      {activeTab === 'wishlist' && (
        <WishlistPage></WishlistPage>
      )}
    </section>
  )
}