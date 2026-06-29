import { useState } from 'react';
import { IconButton, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function GuestMenu({ currentList, onUpdateList, stay }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  function handleCountChange(e, keyName, amount) {
    e.stopPropagation();
    const newValue = (currentList[keyName] || 0) + amount;
    if (newValue < 0) return;
    onUpdateList({
      ...currentList,
      [keyName]: newValue
    });
  }

  const maxCapacity = stay.capacity || 5;
  const totalHumans = (currentList.adults || 0) + (currentList.children || 0);
  const totalGuests =
    (currentList.adults || 0) +
    (currentList.children || 0) +
    (currentList.infants || 0) +
    (currentList.pets || 0);
  const displayCount = totalGuests > 0 ? totalGuests : 1;
  return (
    <div className="guest-triggers">
      <Box
        className="guest-trigger-tile"
        onClick={handleButtonClick}
        role="button"
        style={{ cursor: 'pointer', width: '100%' }}
      >
        <div className="guests-col-one">
          <span className="col-one-title">GUESTS</span>
          <span className="guests-text"> {displayCount}  Guest{stay.capacity > 1 ? 's' : ''}</span>
        </div>
        <div className="guests-col-two">
          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
      </Box>

      {isOpen && (
        <div className="custom-guest-dropdown">

          {/* ADULTS */}
          <div className="dropdown-row">
            <Box className="row-label">
              <span className="title">ADULTS</span>
              <span className="subtitle">Ages 13 or above</span>
            </Box>
            <Box className="row-controls">
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'adults', -1)} disabled={(currentList.adults || 0) <= 0}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <span className="counter-value">{currentList['adults']}</span>
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'adults', +1)} disabled={totalHumans >= maxCapacity}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </div>

          {/* KIDS */}
          <div className="dropdown-row">
            <Box className="row-label">
              <span className="title">KIDS</span>
              <span className="subtitle">Ages 2-12</span>
            </Box>
            <Box className="row-controls">
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'children', -1)} disabled={(currentList.children || 0) <= 0}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <span className="counter-value">{currentList['children']}</span>
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'children', +1)} disabled={totalHumans >= maxCapacity}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </div>

          {/* INFANTS */}
          <div className="dropdown-row">
            <Box className="row-label">
              <span className="title">INFANTS</span>
              <span className="subtitle">Under 2</span>
            </Box>
            <Box className="row-controls">
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'infants', -1)} disabled={(currentList.infants || 0) <= 0}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <span className="counter-value">{currentList['infants']}</span>
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'infants', +1)} disabled={(currentList.infants || 0) > stay.capacity}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </div>

          {/* PETS */}
          <div className="dropdown-row">
            <Box className="row-label">
              <span className="title">PETS</span>
              <span className="subtitle">Woof!</span>
            </Box>
            <Box className="row-controls">
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'pets', -1)} disabled={(currentList.pets || 0) <= 0}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <span className="counter-value">{currentList['pets']}</span>
              <IconButton size="small" onClick={(e) => handleCountChange(e, 'pets', +1)} disabled={(currentList.pets || 0) > stay.capacity}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </div>

        </div>
      )}
    </div>
  );
}