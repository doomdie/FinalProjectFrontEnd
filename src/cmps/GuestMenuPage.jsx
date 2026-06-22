import { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export function GuestMenuPage() {
  const [currentList, setCurrentList] = useState({
    capacity: 0,
   
  });

  function handleCountChange(e, keyName, amount) {
    e.stopPropagation();
    const newValue = (currentList[keyName] || 0) + amount;
    if (newValue < 0) return;
    
    setCurrentList({
      ...currentList,
      [keyName]: newValue
    });
  }

  return (
    <section className="guest-menu-container">
      
      <div className="guest-row">
        <div className="guest-label-group">
          <span className="guest-title">CAPACITY</span>
          <span className="guest-subtitle">Stay Capacity</span>
        </div>
        <div className="guest-counter-group">
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'capacity', -1)}
            disabled={(currentList.capacity || 0) <= 0}
          >
            <RemoveIcon fontSize="small" />
          </button>
          <span className="counter-value">{currentList['capacity']}</span>
          <button
            type="button"
            className="counter-btn"
            onClick={(e) => handleCountChange(e, 'capacity', +1)}
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      </div>



    </section>
  );
}