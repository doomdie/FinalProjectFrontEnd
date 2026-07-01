import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders, saveOrder } from '../store/actions/order.actions'

export function PendingReservations() {
  const user = useSelector(storeState => storeState.userModule.user)
  const orders = useSelector(storeState => storeState.orderModule.orders)
  const approvedOrders = orders.filter(order => order.status === 'approved')
  useEffect(() => {
    if (!user) return

    loadOrders({ hostId: user._id })

    function onTabFocus() {
      loadOrders({ hostId: user._id })
    }

    window.addEventListener('focus', onTabFocus)
    return () => {
      window.removeEventListener('focus', onTabFocus)
    }
  }, [user])

  async function onUpdateStatus(order, status) {
    try {
      const updatedOrder = { ...order, status }
      await saveOrder(updatedOrder)
    } catch {
      console.log("UGH")
    }
  }

  const pendingOrders = orders.filter(order => order.status === 'pending')

 return (
    <main className="pending-main">
      <h2>Pending Reservations</h2>
      {!pendingOrders.length ? (
        <p>No pending reservations to approve right now.</p>
      ) : (
        <ul className="clean-list dashboard-orders-list">
          {pendingOrders.map(order => (
            <li key={order._id} className="order-item">
              <div className="order-details">
                <p><strong>Stay:</strong> {order.stay.name}</p>
                <p><strong>Guest:</strong> {order.buyer.fullname}</p>
                <p><strong>Dates:</strong> {order.startDate} – {order.endDate}</p>
                <p><strong>Total:</strong> ₪{order.totalPrice}</p>
              </div>
              <div className="order-actions">
                <button className="btn-approve" onClick={() => onUpdateStatus(order, 'approved')}>Accept</button>
                <button className="btn-decline" onClick={() => onUpdateStatus(order, 'declined')}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Approved Reservations</h2>
      {!approvedOrders.length ? (
        <p>No approved reservations yet.</p>
      ) : (
        <ul className="clean-list dashboard-orders-list">
          {approvedOrders.map(order => (
            <li key={order._id} className="order-item approved">
              <div className="order-details">
                <p><strong>Stay:</strong> {order.stay.name}</p>
                <p><strong>Guest:</strong> {order.buyer.fullname}</p>
                <p><strong>Dates:</strong> {order.startDate} – {order.endDate}</p>
                <p><strong>Total:</strong> ₪{order.totalPrice}</p>
              </div>
              <div className="order-status-badge approved">✓ Accepted</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
