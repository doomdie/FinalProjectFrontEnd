import { useEffect } from 'react'
import { useSelector } from 'react-redux' 
import { useNavigate } from 'react-router-dom'

import { StayMiniList } from '../cmps/StayMiniList'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadStays, removeStay } from '../store/actions/stay.actions'

export function UserDetails() {
  const user = useSelector(storeState => storeState.userModule.user)
  const stays = useSelector(storeState => storeState.stayModule.stays)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      console.log("FUCK YOU")
      showErrorMsg('Please sign in first')
      return
    }
    
    loadStays({ byUserId: user._id })
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

  return (
    <section className="user-details">
      <h1>Hello {user.fullname}</h1>
      <StayMiniList stays={stays} onRemoveStay={onRemoveStay} />
      {!stays.length && <span>you haven't posted any listings yet</span>}
    </section>
  )
}