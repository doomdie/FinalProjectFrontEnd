import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StayMiniList } from '../cmps/StayMiniList'
import { loadStays, removeStay } from '../store/actions/stay.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user/user.service.local.js'

export function PublicProfile() {
  const { id } = useParams()
  const [displayedUser, setDisplayedUser] = useState(null)
  const stays = useSelector(storeState => storeState.stayModule.stays)

  useEffect(() => {
    async function loadUser() {
      try {
        const fetchedUser = await userService.getById(id)
        setDisplayedUser(fetchedUser)
        loadStays({ byUserId: id })
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

  const hostStays = stays ? stays.filter(stay => {
    return stay.host?._id === id || stay.host?.id === id
  }) : []

  return (
    <section className="public-profile">
      
      <header className="profile-header">
        <img src={displayedUser.imgUrl} alt={displayedUser.fullname} className="profile-avatar" />
        <h1>About {displayedUser.fullname}</h1>
        <p>📍 {displayedUser.location || "Tel Aviv-Yafo, Israel"}</p>
      </header>

      <hr />

      {displayedUser.isHost && hostStays.length > 0 && (
        <fieldset className="profile-listings">
          <legend>My Listings</legend>
          <StayMiniList stays={hostStays} onRemoveStay={onRemoveStay} />
        </fieldset>
      )}

    </section>
  )
}