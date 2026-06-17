import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { loadStay } from '../store/actions/stay.actions'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  if (!stay) return <div>Loading stay details...</div>
console.log(stay.imgUrls)
return (
  <section className="stay-details">
    <Link to="/homes">Back to list</Link>
    <h1>Stay Details</h1>
    <div>
      <h3>{stay.name}</h3>
      <div className = "details-gallery">
     {stay.imgUrls.map((url, index) => (
    <img 
        key={index}
        src={url} 
        alt={stay.name} 
        className="stay-card-img" 
    />
))}
</div>
      {stay.host && <h3>Host: {stay.host.fullname}</h3>}
      <h4>${stay.price} / night</h4>
      {/* <pre>{JSON.stringify(stay, null, 2)}</pre> */}
    </div>
  </section>
)
}