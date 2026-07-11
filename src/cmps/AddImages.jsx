import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { uploadService } from '../services/upload.service'

export function AddImages({ imgUrls, onUpdateImages }) {
    const [isUploading, setIsUploading] = useState(false)

    async function handleFileChange(e) {
        const files = Array.from(e.target.files).slice(0, 5 - imgUrls.length)
        if (!files.length) return
        setIsUploading(true)
        try {
            const results = await Promise.all(
                files.map(file => uploadService.uploadImg({ target: { files: [file] } }))
            )
            const newUrls = results.map(imgData => imgData.secure_url)
            onUpdateImages([...imgUrls, ...newUrls].slice(0, 5))
        } catch (err) {
            console.error('Image upload failed', err)
        } finally {
            setIsUploading(false)
            e.target.value = ''   
        }
    }

    function handleRemoveImage(indexToRemove) {
        onUpdateImages(imgUrls.filter((_, index) => index !== indexToRemove))
    }

    return (
        <section className="guest-menu-container">
            <div className="upload-header">
                <h3>Upload Images ({imgUrls.length}/5)</h3>

                <label htmlFor="file-upload" className={`upload-btn ${imgUrls.length >= 5 || isUploading ? 'disabled' : ''}`}>
                    <AddIcon /> {isUploading ? 'Uploading...' : 'Add Images'}
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={imgUrls.length >= 5 || isUploading}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            <div className="image-preview-grid">
                {imgUrls.map((url, index) => (
                    <div key={index} className="image-card">
                        <img src={url} alt={`Uploaded preview ${index + 1}`} className="preview-img" />
                        <button
                            type="button"
                            className="remove-img-btn"
                            onClick={() => handleRemoveImage(index)}
                        >
                            <RemoveIcon fontSize="small" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}