import { useState } from 'react'

export function StayBioAndName({ title, description, onUpdate }) {
    const TITLE_MAX = 50
    const DESC_MAX = 500

    function handleTitleChange(e) {
        onUpdate({ title: e.target.value.slice(0, TITLE_MAX) })
    }

    function handleDescChange(e) {
        onUpdate({ description: e.target.value.slice(0, DESC_MAX) })
    }

    return (
        <section className="title-desc-step">
            <div className="field-group">
                <h2 className="field-title">Now, let's give your barn a title</h2>
                <p className="field-subtitle">
                    Short titles work best. Have fun with it—you can always change it later.
                </p>
                <textarea
                    className="field-textarea"
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={TITLE_MAX}
                    rows={4}
                />
                <span className="char-counter">{title.length}/{TITLE_MAX}</span>
            </div>

            <div className="field-group">
                <h2 className="field-title">Create your description</h2>
                <p className="field-subtitle">
                    Share what makes your place special.
                </p>
                <textarea
                    className="field-textarea"
                    value={description}
                    onChange={handleDescChange}
                    maxLength={DESC_MAX}
                    rows={6}
                />
                <span className="char-counter">{description.length}/{DESC_MAX}</span>
            </div>
        </section>
    )
}