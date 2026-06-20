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
    <div className="guest-triggers">
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
        <MenuItem component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}>
          ADULTS
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'adults', -1)}
              disabled={(currentList.adults || 0) <= 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <span>{currentList['adults']}</span>

            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'adults', +1)}
              disabled={(currentList.adults || 0) > stay.capacity}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

          </Box>


        </MenuItem>


      </Menu>
    </div>
  );
}
