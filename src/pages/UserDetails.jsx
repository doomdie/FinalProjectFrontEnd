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

export function UserDetails() {
  const user = useSelector(storeState => storeState.userModule.user)
  const stays = useSelector(storeState => storeState.stayModule.stays)
  const orders = useSelector(storeState => storeState.orderModule.orders)

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('stays')

  useEffect(() => {
    if (!user) {
      navigate('/')
      showErrorMsg('Please sign in first')
      return
    }

    loadStays({ byUserId: user._id })
    loadOrders()
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
  const userId = user._id || user.id

  const hostStays = stays ? stays.filter(stay => {
    return stay.host?._id === userId || stay.host?.id === userId
  }) : []

  const now = new Date()
  console.log("All raw orders from state:", orders)
  const pastTrips = orders ? orders.filter(order => {
    const isBuyer = order.buyer?._id === userId || order.buyer?.id === userId
    const tripEndDate = order.endDate ? new Date(order.endDate) : null
    const isPast = tripEndDate && tripEndDate < now
    return isBuyer && isPast
  }) : []
  return (
    <section className="user-details-full">

      <aside className="user-aside">
        <div className="aside-organizer">
          <h3>Profile</h3>
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            My Details
          </button>
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
          <button
            className={`tab-btn ${activeTab === 'past-trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('past-trips')}
          >
            Past Trips
          </button>
        </div>
      </aside>



      {activeTab === 'stays' && (
        <div className="tab-mini-content">
          <StayMiniList stays={hostStays} onRemoveStay={onRemoveStay} />
          {!stays.length && <span>you haven't posted any listings yet</span>}
        </div>
      )}
      {activeTab === 'details' && (
        <div className="tab-info-content">
          <UserInfo></UserInfo>
          {!stays.length && <span>you haven't posted any listings yet</span>}
        </div>
      )}
      {activeTab === 'pending' && (
        <div className="tab-mini-content">

          <PendingReservations></PendingReservations>
          {/* <p>No pending reservations to approve right now.</p> */}
          {/*I  don't know if like, we're supposed to be able to sync stuff through different instances when we're still only front end. yair remember to ask */}
        </div>
      )}
      {activeTab === 'past-trips' && (
        <div className="tab-past-content">
          <PastTrips trips={pastTrips} ></PastTrips>

        </div>
      )}



    </section>
  )
}