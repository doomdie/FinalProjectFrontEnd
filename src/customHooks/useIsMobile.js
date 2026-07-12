import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 743

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT)

    useEffect(() => {
        function onResize() {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    return isMobile
}