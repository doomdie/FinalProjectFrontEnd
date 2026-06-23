import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function AddImages({ imgUrls, onUpdateImages }) {

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    const updatedImages = [...imgUrls, ...newImageUrls].slice(0, 5);
    onUpdateImages(updatedImages);
  }

  function handleRemoveImage(indexToRemove) {
    const updatedImages = imgUrls.filter((_, index) => index !== indexToRemove);
    onUpdateImages(updatedImages);
  }

  return (
    <section className="guest-menu-container">
      <div className="upload-header">
        <h3>Upload Images ({imgUrls.length}/5)</h3>
        
        <label htmlFor="file-upload" className={`upload-btn ${imgUrls.length >= 5 ? 'disabled' : ''}`}>
          <AddIcon /> Add Images
          <input 
            id="file-upload"
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={imgUrls.length >= 5}
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
  );
}