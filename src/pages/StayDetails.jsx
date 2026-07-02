import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AmenitiesList } from '../cmps/AmenitiesList'
import { store } from '../store/store'
import { loadStay } from '../store/actions/stay.actions'
import { StickyCard } from "../cmps/StickyCard"
import { StayReview } from "../cmps/StayReview"
import { ReadMore } from '../cmps/ReadMore'
import Divider from '@mui/material/Divider';
import { LoadingScreenForDetails } from '../cmps/LoadingScreenForDetails'

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

  const isLoading = !stay;

  return (
    <section className="stay-details">
      <LoadingScreenForDetails isLoading={isLoading} />

      {stay && (
        <>
          <h1>{stay.name}</h1>

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
                <h4>{stay.roomType} in {stay.loc.city}</h4>
                <ul className="stay-info-list">
                  <ol className="stay-info-ol">
                    <li> {stay.capacity}+  Guest{stay.capacity > 1 ? 's' : ''}</li> 
                    <li><span className="listSeperator">·</span>{stay.bedrooms} Bedroom{stay.bedrooms > 1 ? 's' : ''}<span className="listSeperator">·</span> </li>
                    <li> {stay.bathrooms} Bathrooms{stay.bathrooms > 1 ? 's' : ''}</li>
                  </ol>
                </ul>
                <div className="stay-header-reviews"></div>
              </header>

              <section className="further-details">
                <div className="firstColumn">
                  <Divider sx={{ borderColor: '#e0e0e0' }} />
                  <section className="host-profile">
                    <img
                      src={placeholderAvatar}
                      alt={stay.name}
                      className="stay-card-img"
                    />
                    <div className="hostText">
                      {stay.host && <span className="host-name">Hosted by {stay.host.fullname}</span>}
                      {stay.host?.isSuperHost && <p>Superhost *Placeholder</p>} 
                      {stay.host && !stay.host.isSuperHost && <span className="host-undertext">Yo! This is a placeholder!</span>}
                    </div>
                  </section>
                  <Divider sx={{ borderColor: '#e0e0e0' }} />
                  <section className="stay-highlights">
                    <h3>Summary</h3>
                    <ReadMore text={stay.summary} /> 
                  </section>
                </div>
              </section>
            </section>

            <StickyCard stay={stay}></StickyCard>
          </main>
          
          <StayReview stay={stay}></StayReview>
        </>
      )}
    </section>
  )
}