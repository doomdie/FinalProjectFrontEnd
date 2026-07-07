import { useEffect } from 'react'

export function SeeMoreModal({ title, onClose, children }) {
    useEffect(() => {
        const onKey = (ev) => { if (ev.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div className="see-more-modal-backdrop" onClick={onClose}>
            <div className="see-more-modal" onClick={(ev) => ev.stopPropagation()}>
                <button className="see-more-modal-close" aria-label="Close" onClick={onClose}>✕</button>
                {title && <h2 className="see-more-modal-title">{title}</h2>}
                <div className="see-more-modal-body">{children}</div>
            </div>
        </div>
    )
}