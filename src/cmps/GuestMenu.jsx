import { useState } from 'react';
import { Button, Menu, MenuItem, IconButton, Typography, Box } from '@mui/material'; //Just incase.. Ugh

import RemoveIcon from '@mui/icons-material/Remove';

export function GuestMenu({ currentList, onUpdateList, stay }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  
//   const handleEditAction = () => {
//     console.log("Edit function activated!");
//     handleCloseMenu(); 
//   };
function handleCountChange(e, keyName, amount) {

        e.stopPropagation();
        const newValue = (currentList[keyName] || 0) + amount;
        if (newValue < 0) return;
        onUpdateList({
      ...currentList,
      [keyName]: newValue
    });
  };
    



  return (
    <div className ="guest-triggers">
      <Button 
        variant="contained" 
        onClick={handleButtonClick}
      >
        GUEST AMOUNT
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        disablePortal
        slotProps={{
        paper: {
          className: 'custom-guest-dropdown' 
        }
      }}
      >
       <MenuItem component="div">
          ADULTS
          <IconButton 
              size="small" 
              onClick={(e) => handleCountChange(e, 'adults', -1)}
              disabled={(currentList.adults || 0) <= 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={(e) => handleCountChange(e, 'adults', +1)}
              disabled={(currentList.adults || 0) > stay.capacity}
            >
              <span>{currentList['adults']}</span>
              <RemoveIcon fontSize="small" />
            </IconButton>
        </MenuItem>
        
  
      </Menu>
    </div>
  );
}
