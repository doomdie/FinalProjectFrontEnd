import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AmenitiesList } from '../cmps/AmenitiesList'
import { ReadMore } from '../cmps/ReadMore'
import { store } from '../store/store'
import { loadStay } from '../store/actions/stay.actions'
import { StickyCard } from "../cmps/StickyCard"
import { StayReview } from "../cmps/StayReview"


export function StayDetails() {
  const { stayId } = useParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const stay = useSelector(storeState => storeState.stayModule.stay)
  console.log(stay)
  const placeholderAvatar = 'https://images.pexels.com/photos/18039300/pexels-photo-18039300.jpeg'

  useEffect(() => {
    loadStay(stayId)

    return () => {
      store.dispatch({ type: 'SET_STAY', stay: null })
    }
  }, [stayId])

  if (!stay) return <div>Loading stay details...</div>

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
            <ul className="stay-info-list">
              <li> Bedrooms: {stay.bedrooms}</li>
              <li>Bathrooms: {stay.bathrooms}</li>
              <li>Reviews: {stay.reviews.length}</li>
            </ul>
          </header>

          <section className="further-details">
            <div className = "firstColumn">
            <section className="host-profile">
              <img
                src={placeholderAvatar}
                alt={stay.name}
                className="stay-card-img"
              />
              <div className="hostText">
                {stay.host && <h3>Host: {stay.host.fullname}</h3>}
                <p>Superhost *Placeholder</p>
              </div>
               
            </section>
            <section className="stay-highlights">
              <h3>Summary</h3>
              <ReadMore text={stay.summary} /> 
            </section>
            </div>
            {/* <div className = "miscInfo"> This is the host with the</div> */}
            {/* {stay.amenities && <AmenitiesList amenities={stay.amenities} />} */}
            
           
          
           

          </section>
        </section>

       
        <StickyCard stay = {stay}></StickyCard>
      </main>
      <StayReview stay = {stay}></StayReview>
    </section>
  )
}