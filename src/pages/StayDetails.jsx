import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AmenitiesList } from '../cmps/AmenitiesList'
import { store } from '../store/store'
import { loadStay } from '../store/actions/stay.actions'
import { StickyCard } from "../cmps/StickyCard"
import { StayReview } from "../cmps/StayReview"
import { ReadMore } from '../cmps/ReadMore'
import Divider from '@mui/material/Divider';
import { SkeletonLoader } from '../cmps/SkeletonLoader.jsx'

export function StayDetails() {
  
  const { stayId } = useParams()
  console.log('--- STAY DETAILS MOUNT/RENDER ---')
  console.log('Extracted stayId from URL params:', stayId)
  const navigate = useNavigate()
  const [mobileFooterData, setMobileFooterData] = useState({ price: 0, dateRange: 'Add dates' })
  const [isExpanded, setIsExpanded] = useState(false)
  const stay = useSelector(storeState => storeState.stayModule.stay)
  console.log('Current stay value from Redux store:', stay)
  const placeholderAvatar = 'https://images.pexels.com/photos/18039300/pexels-photo-18039300.jpeg'

  useEffect(() => {
    loadStay(stayId)

    return () => {
    }
  }, [stayId])

  const isLoading = !stay || stay._id !== stayId;
  return (
    <section className="stay-details">
      <SkeletonLoader variant="details" isLoading={isLoading} />

      {stay && (
        <>
          <header className="mobile-only-header">
            <button className="mobile-back-btn" onClick={() => navigate(-1)}>
              ‹
            </button>
            <div className="mobile-header-actions">
              <button className="mobile-action-btn" aria-label="Share">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: 3, overflow: 'visible' }}
                >
                  <path d="M27 18v9c0 1.1046-.08954 2-2 2H7c-1.10457 0-2-.08954-2-2V18m11-15v21m-10-11l9.2929-9.29289c.3905-.39053 1.0237-.39053 1.4142 0l9.2929 9.29289" fill="none"></path>
                </svg>
              </button>
              <button className="mobile-action-btn" aria-label="Like">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: 3, overflow: 'visible' }}
                >
                  <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
                </svg>
              </button>
            </div>
          </header>
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
                      src={stay.host.pictureUrl}
                      alt={stay.name}
                      className="stay-card-img"
                    />
                    <div className="host-text">
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

            <StickyCard
              stay={stay}
              onUpdateFooter={(price, dateRange) => setMobileFooterData({ price, dateRange })}
            />

          </main>
          <footer className="mobile-sticky-footer">
            <div className="footer-price-info">
              <span className="price-total">₪{mobileFooterData.price} total</span>
              <span className="price-dates">{mobileFooterData.dateRange}</span>
            </div>
            <button
              className="mobile-reserve-btn"
              onClick={() => document.querySelector('.reserve-btn')?.click()}
            >
              Reserve
            </button>
          </footer>
          <StayReview stay={stay}></StayReview>
        </>
      )}
    </section>
  )
}