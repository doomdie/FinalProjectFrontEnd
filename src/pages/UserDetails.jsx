import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux' 
import { useNavigate } from 'react-router-dom'

import { StayMiniList } from '../cmps/StayMiniList'
import { PendingReservations } from '../cmps/PendingReservations'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadStays, removeStay } from '../store/actions/stay.actions'

export function UserDetails() {
  const user = useSelector(storeState => storeState.userModule.user)
  const stays = useSelector(storeState => storeState.stayModule.stays)
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('stays') 

  useEffect(() => {
    if (!user) {
      navigate('/')
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
    <section className="user-details-full">
      
      <aside className="user-aside">
        <h3>Profile</h3>
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
          ⏳ Pending Reservations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
           Reservations
        </button>
      </aside>

      <main className="user-details-main">
        <h1>Hello {user.fullname}</h1>

        {activeTab === 'stays' && (
          <div className="tab-content">
            <h2>My Stays</h2>
            <StayMiniList stays={stays} onRemoveStay={onRemoveStay} />
            {!stays.length && <span>you haven't posted any listings yet</span>}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="tab-content">
            <h2>Pending Reservations</h2>
            <PendingReservations></PendingReservations>
            {/* <p>No pending reservations to approve right now.</p> */}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="tab-content">
            <h2>Your Confirmed Reservations</h2>
            <p>Your upcoming trip details will show up here.</p>
          </div>
        )}
      </main>

    </section>
  )
}