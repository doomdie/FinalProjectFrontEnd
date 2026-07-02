import { useEffect } from 'react'

export function LoadingScreen({ isLoading }) {
  useEffect(() => {
    if (isLoading) {
      const scrollY = window.scrollY
      document.body.setAttribute('data-scroll-y', scrollY)
      
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const savedScroll = document.body.getAttribute('data-scroll-y')
      
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      
      window.scrollTo(0, 0)
    }

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isLoading])

  if (!isLoading) return null

  return <div className="airbnb-freeze-indicator" style={{ display: 'none' }} />
}
//PLEASE WORK