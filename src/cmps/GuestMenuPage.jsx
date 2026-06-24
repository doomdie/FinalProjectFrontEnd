import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export function GuestMenuPage({ currentList, onChangeCount }) {

  function handleCountChange(e, keyName, amount) {
    e.stopPropagation();
    const newValue = (currentList[keyName] || 0) + amount;
    if (newValue < 0) return;
    onChangeCount(keyName, newValue);
  }

  return (
    <section className="guest-menu-container">
      <header className = "capacityHeader"><h1>Share some basics about your place</h1> <h2>You'll add more details later, like bed types.
</h2></header>
      <div className="guest-row">
        <div className="guest-label-group">
          <span className="guest-title">Guests</span>
         
        </div>
        <div className="guest-counter-group">
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'capacity', -1)}
            disabled={(currentList?.capacity || 0) <= 0}
          >
            <RemoveIcon fontSize="small" />
          </button>
          <span className="counter-value">{currentList?.capacity || 0}</span>
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'capacity', 1)}
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="guest-row">
        <div className="guest-label-group">
          <span className="guest-title">Bedrooms</span>
        </div>
        <div className="guest-counter-group">
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'bedrooms', -1)}
            disabled={(currentList?.bedrooms || 0) <= 0}
          >
            <RemoveIcon fontSize="small" />
          </button>
          <span className="counter-value">{currentList?.bedrooms || 0}</span>
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'bedrooms', 1)}
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="guest-row">
        <div className="guest-label-group">
          <span className="guest-title">Bathrooms</span>
        </div>
        <div className="guest-counter-group">
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'bathrooms', -1)}
            disabled={(currentList?.bathrooms || 0) <= 0}
          >
            <RemoveIcon fontSize="small" />
          </button>
          <span className="counter-value">{currentList?.bathrooms || 0}</span>
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'bathrooms', 1)}
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      </div>
    </section>
  );
}