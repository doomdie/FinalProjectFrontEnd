import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function SeeMoreModal({ title, onClose, children, size = '', pushedBack = false }) {
    useEffect(() => {
        const onKey = (ev) => { if (ev.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return createPortal(
        <div className="see-more-modal-backdrop" onClick={onClose}>
            <div className={`see-more-modal ${size} ${pushedBack ? 'pushed-back' : ''}`} onClick={(ev) => ev.stopPropagation()}>
                <button className="see-more-modal-close" aria-label="Close" onClick={onClose}>✕</button>
                {title && <h2 className="see-more-modal-title">{title}</h2>}
                <div className="see-more-modal-body">{children}</div>
            </div>
        </div>,
        document.body

    )
}