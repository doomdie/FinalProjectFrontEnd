import { createPortal } from 'react-dom'

export function ServiceAnimalModal({ onClose }) {
    return createPortal(
        <div className="service-modal-overlay" onClick={onClose}>
            <div className="service-modal" onClick={(ev) => ev.stopPropagation()}>
                <div className="service-modal-header">
                    <h3 className="service-modal-header-title">Service animals</h3>
                    <button className="service-modal-close" onClick={onClose}>×</button>
                </div>

                <img src="/img/care-dog.jpg" alt="Service animal" className="service-modal-img" />
                <div className="service-modal-text">
                    <h3>Service animals</h3>
                    <p>Service animals aren't pets, so there's no need to add them here.</p>
                    <p>Traveling with an emotional support animal? Check out our <a href="#" className="service-link">accessibility policy</a>.</p>
                </div>
            </div>
        </div>,
        document.body
    )
}