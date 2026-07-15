import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const timeoutIdRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBus.on('show-msg', msg => {
            setMsg(msg)
            setIsVisible(true)
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = setTimeout(closeMsg, 4000)
        })

        socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
            showSuccessMsg(`New review about you: "${review.txt}"`)
        })

        return () => {
            unsubscribe()
            socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
            clearTimeout(timeoutIdRef.current)
        }
    }, [])

    function closeMsg() {
        setIsVisible(false)
    }

    return (
        <section className={`user-msg ${msg?.type || ''} ${isVisible ? 'visible' : ''}`}>
            <span className="user-msg-icon" aria-hidden="true">
                {msg?.type === 'error' ? '!' : '✓'}
            </span>
            <p className="user-msg-txt">{msg?.txt}</p>
            <button className="user-msg-close" onClick={closeMsg} aria-label="Close">
                ✕
            </button>
        </section>
    )
}