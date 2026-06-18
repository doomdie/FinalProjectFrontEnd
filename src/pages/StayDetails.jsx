import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { loadStay } from '../store/actions/stay.actions'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const placeholderAvatar = 'https://images.pexels.com/photos/18039300/pexels-photo-18039300.jpeg'
  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  if (!stay) return <div>Loading stay details...</div>
console.log(stay.host.pictureUrl)
return (
  <section className="stay-details">
    <h1>Stay Details</h1>
    
    <div className="details-gallery">
      {stay.imgUrls.map((url, index) => (
        <img 
          key={index}
          src={url} 
          alt={stay.name} 
          className="stay-card-img" 
        />
      ))}
    </div>

    <main className="stay-content-container">
      
      <section className="stay-info-main">
        
        <header className="stay-overview-header">
          <h4>{stay.name}</h4>
          <ul className = "stay-info-list"><li> Bedrooms: {stay.bedrooms}</li><li>Bathrooms: {stay.bathrooms}</li><li>Reviews: {stay.reviews.length}</li></ul>
          
        </header>
 {/* Add review stuff */}
        <section className="further-details">
          
          <section className="host-profile">
            <img 
          src={placeholderAvatar} 
          alt={stay.name} 
          className="stay-card-img" 
        />  
        <div className = "hostText">
            {stay.host && <h3>Host: {stay.host.fullname}</h3>}
            <p>Superhost · 3 years hosting</p>
            </div>
          </section>


          <section className="stay-highlights">
            <h3>Home highlights</h3> 
            <ul>
              <li>Self check-in</li>
              <li>Amazing outdoor space</li>
            </ul>
          </section>

          <section className="stay-description">
            <h3>Description</h3> 
            <p>Welcome to a luxurious family retreat...</p>
          </section>

        </section> 
      </section> 

      <aside className="booking-sidebar">
      </aside>

    </main>
 
  </section>
)
}
// Find out how to make the header shorter on this page