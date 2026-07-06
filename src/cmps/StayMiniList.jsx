// import { userService } from '../services/user/user.service.local.js'
import { userService } from '../services/user'

import { StayCard } from './StayCard.jsx'

export function StayMiniList({ stays, onRemoveStay }) {
  function shouldShowActionBtns(stay) {
    const user = userService.getLoggedinUser()
    if (!user) return false
    // if (user.isAdmin) return true
    return stay.byUser?._id === user._id
  }

  return (
    <main className = "mini-main">
      <ul className="list stay-mini-list clean-list">
        {stays.map(stay => (
          <li className='stay-article' key={stay._id}>
            <StayCard stay={stay} />
            {shouldShowActionBtns(stay) && (
              <div className="actions">
                <button onClick={() => onRemoveStay(stay._id)}>x</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
