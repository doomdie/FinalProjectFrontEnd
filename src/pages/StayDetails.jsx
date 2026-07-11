import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AmenitiesList } from '../cmps/AmenitiesList'
import { loadStay } from '../store/actions/stay.actions'
import { StickyCard } from "../cmps/StickyCard"
import { StayReview } from "../cmps/StayReview"
import { ReadMore } from '../cmps/ReadMore'
import Divider from '@mui/material/Divider';
import { SkeletonLoader } from '../cmps/SkeletonLoader.jsx'
import { SvgIcon } from '../services/svg.service.jsx'
import { HeartButton } from '../cmps/HeartButton.jsx'
import { StayDetailsMap } from '../cmps/StayDetailsMap.jsx'
import { StayDetailsNav } from '../cmps/StayDetailsNav.jsx'
import { userService } from '../services/user'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { getYearsSince } from '../services/util.service.js'

export function StayDetails() {
  const { stayId } = useParams()
  const [hostUser, setHostUser] = useState(null)
  const navigate = useNavigate()
  const [mobileFooterData, setMobileFooterData] = useState({ price: 0, dateRange: 'Add dates' })
  const stay = useSelector(storeState => storeState.stayModule.stay)
  const reviews = useSelector(storeState => storeState.reviewModule.reviews)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  async function onShare() {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: stay.name, url }) } catch (err) { }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      showSuccessMsg('Link copied to clipboard')
    } catch (err) {
      showErrorMsg('Could not copy link')
    }
  }

  const isLoading = !stay || stay._id !== stayId;

  const safeStay = stay ? {
    ...stay,
    loc: {
      ...stay.loc,
      lat: Number(stay.loc?.coordinates?.[1]) || 0,
      lng: Number(stay.loc?.coordinates?.[0]) || 0
    }
  } : null;



  useEffect(() => {
    if (!stay?.host?._id) return
    userService.getById(stay.host._id)
      .then(setHostUser)
      .catch(err => console.error('Cannot load host', err))
  }, [stay?.host?._id])

  const avgRating = reviews?.length
    ? Number((reviews.reduce((sum, r) => sum + (r.rating || r.rate || 0), 0) / reviews.length).toFixed(1))
    : null

  return (
    <section className="stay-details">
      <SkeletonLoader variant="details" isLoading={isLoading} />

      {stay && !isLoading && (
        <>
          <StayDetailsNav />
          <header className="mobile-only-header">
            <button className="mobile-back-btn" onClick={() => navigate(-1)}>‹</button>
            <div className="mobile-header-actions">
              <button className="mobile-action-btn" aria-label="Share">
                <svg viewBox="0 0 32 32" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: 3, overflow: 'visible' }}><path d="M27 18v9c0 1.1046-.08954 2-2 2H7c-1.10457 0-2-.08954-2-2V18m11-15v21m-10-11l9.2929-9.29289c.3905-.39053 1.0237-.39053 1.4142 0l9.2929 9.29289" fill="none"></path></svg>
              </button>
              <button className="mobile-action-btn" aria-label="Like">
                <svg viewBox="0 0 32 32" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: 3, overflow: 'visible' }}><path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path></svg>
              </button>
            </div>
          </header>

          <div className="details-title-row">
            <h1>{stay.name}</h1>
            <div className="details-title-actions">
              <button className="details-action-btn" onClick={onShare}><SvgIcon iconName="share" /><span>Share</span></button>
              <button className="details-action-btn details-save-btn" onClick={() => document.querySelector('.save-heart')?.click()}>
                <HeartButton stay={stay} className="save-heart" /><span>Save</span>
              </button>
            </div>
          </div>

          {/* <div className="details-gallery" id="photos">
            {stay.imgUrls.map((url, index) => (
              <img key={index} src={url} alt={stay.name} className="stay-card-img" />
            ))}
          </div> */}
          <div className="details-gallery" id="photos">
            {(stay.imgUrls?.length ? stay.imgUrls : ['/img/default-stay.png']).map((url, index) => (
              <img
                key={index}
                src={url || '/img/default-stay.png'}
                alt={stay.name || 'Stay'}
                className="stay-card-img"
                onError={ev => { ev.target.onerror = null; ev.target.src = '/img/default-stay.png' }}
              />
            ))}
          </div>

          <main className="stay-content-container">
            <section className="stay-info-main">
              <header className="stay-overview-header">
                <h4>{stay.type.charAt(0).toUpperCase() + stay.type.slice(1)} in {stay.loc.city}</h4>
                <div className="stay-info-line">
                  {stay.capacity} guest{stay.capacity > 1 ? 's' : ''}
                  <span className="listSeperator">·</span>
                  {stay.bedrooms} bedroom{stay.bedrooms > 1 ? 's' : ''}
                  <span className="listSeperator">·</span>
                  {stay.bathrooms} bathroom{stay.bathrooms > 1 ? 's' : ''}
                </div>
                <div className="stay-header-reviews">
                  ★ {avgRating || 'New'}
                  <span className="listSeperator">·</span>
                  {reviews?.length || 0} review{reviews?.length === 1 ? '' : 's'}
                </div>
              </header>

              <section className="further-details">
                <div className="firstColumn">
                  <Divider sx={{ borderColor: '#e0e0e0' }} />
                  <section className="host-profile">
                    <img
                      src={stay.host?.imgUrl || '/img/default-user.png'}
                      alt={stay.host?.fullname || 'Host'}
                      className="stay-card-img"
                    />
                    <div className="host-text">
                      {stay.host && <span className="host-name">Hosted by {stay.host.fullname}</span>}
                      <span className="host-undertext">
                        {stay.host?.isSuperhost && <>Superhost<span className="listSeperator">·</span></>}
                        {getYearsSince(hostUser?.createdAt)} years hosting
                      </span>
                    </div>
                  </section>
                  <Divider sx={{ borderColor: '#e0e0e0' }} />
                  <section className="stay-highlights"><ReadMore text={stay.summary} /></section>
                  <Divider sx={{ borderColor: '#e0e0e0' }} />
                  <div id="amenities"><AmenitiesList amenities={stay.amenities} /></div>
                </div>
              </section>
            </section>
            <StickyCard stay={stay} onUpdateFooter={(price, dateRange) => setMobileFooterData({ price, dateRange })} />
          </main>

          <Divider sx={{ borderColor: '#e0e0e0' }} />
          <footer className="mobile-sticky-footer">
            <div className="footer-price-info">
              <span className="price-total">₪{mobileFooterData.price} total</span>
              <span className="price-dates">{mobileFooterData.dateRange}</span>
            </div>
            <button className="mobile-reserve-btn" onClick={() => document.querySelector('.reserve-btn')?.click()}>Reserve</button>
          </footer>

          <div id="reviews"><StayReview stay={stay}></StayReview></div>
          <Divider sx={{ borderColor: '#e0e0e0' }} />
          <div id="location"><StayDetailsMap stay={safeStay} /></div>
        </>
      )}
    </section>
  )
}