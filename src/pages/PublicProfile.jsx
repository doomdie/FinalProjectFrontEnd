import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StayMiniList } from '../cmps/StayMiniList'
import { loadStays, removeStay } from '../store/actions/stay.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user/user.service.local.js'
import { loadOrders } from '../store/actions/order.actions'
export function PublicProfile() {
  const { id } = useParams()
  const [displayedUser, setDisplayedUser] = useState(null)
  const trips = useSelector(storeState => storeState.orderModule.guestOrders) || []
  const hostStays = useSelector(storeState => storeState.stayModule.hostStays) || []

  useEffect(() => {
    async function loadUser() {
      try {
        const fetchedUser = await userService.getById(id)
        setDisplayedUser(fetchedUser)
        loadStays({ byUserId: id })
        loadOrders({ buyerId: id })
      } catch (err) {
        showErrorMsg('Cannot load user profile')
      }
    }
    if (id) loadUser()
  }, [id])

  async function onRemoveStay(stayId) {
    try {
      await removeStay(stayId)
      showSuccessMsg('Stay removed')
    } catch (err) {
      showErrorMsg('Cannot remove')
    }
  }

  if (!displayedUser) return <p>Loading...</p>

  

  return (
    <section className="public-profile">

      <header className="profile-header">
        {/*        
        <h1>About {displayedUser.fullname}</h1>
        <p>📍 {displayedUser.location || "Tel Aviv-Yafo, Israel"}</p> */}


        <div className="user-card"> <header className="usercard-header"> <img src={displayedUser.imgUrl} alt={displayedUser.fullname} className="profile-avatar" />
          <div className="usercard-text"> <span className="usercard-text-one">{displayedUser.fullname}</span><span className="usercard-text-two"> Guest</span></div>

        </header>
          <div className="usercard-info">
            <div className="usercard-info-card one">
              <span className="usercard-card-header">{trips.length}</span>
              <span className="usercard-card-bottom">Trips</span>
            </div>
            <div className="usercard-info-card two">
              <span className="usercard-card-header">{trips.length}</span>
              <span className="usercard-card-bottom">Trips</span>
            </div>
            <div className="usercard-info-card three">
              <span className="usercard-card-header">{trips.length}</span>
              <span className="usercard-card-bottom">Trips</span>
            </div>
          </div> </div>
      </header>
      <div className="footer-placeholder" />
      {displayedUser.isHost && hostStays.length > 0 && (
        <fieldset className="profile-listings">
          <legend>My Listings</legend>
          <StayMiniList stays={hostStays} onRemoveStay={onRemoveStay} />
        </fieldset>
      )}

    </section>
  )
}