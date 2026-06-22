import { useState } from 'react';
import { Button, Menu, MenuItem, IconButton, Typography, Box } from '@mui/material'; //Just incase.. Ugh

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';


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
  const maxCapacity = stay.capacity || 5;
  console.log(maxCapacity)
  console.log(stay)

  const totalHumans = (currentList.adults || 0) + (currentList.children || 0);



  return (
    <div className="guest-triggers">
      <Box
        className="guest-trigger-tile"
        onClick={handleButtonClick}
        role="button"

      >
        <span className="tile-title">GUESTS</span>
      </Box>

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

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>ADULTS</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Ages 13 or above</span>
          </Box>
          {/* The styles within the code itself are probably frowned upon but I can't seem to get it to work in normal css.. Fuuuckk */}
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
              disabled={totalHumans >= maxCapacity}
            >
              <AddIcon fontSize="small" />
            </IconButton>

          </Box>


        </MenuItem>


        <MenuItem component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>KIDS</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Ages 2-12</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'children', -1)}
              disabled={(currentList.children || 0) <= 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <span>{currentList['children']}</span>

            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'children', +1)}
              disabled={totalHumans >= maxCapacity}            >
              <AddIcon fontSize="small" />
            </IconButton>

          </Box>


        </MenuItem>


        <MenuItem component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>INFANTS</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Under 2</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'infants', -1)}
              disabled={(currentList.infants || 0) <= 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <span>{currentList['infants']}</span>

            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'infants', +1)}
              disabled={(currentList.infants || 0) > stay.capacity}
            >
              <AddIcon fontSize="small" />
            </IconButton>

          </Box>


        </MenuItem>


        <MenuItem component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>PETS</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Woof! Lol</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'pets', -1)}
              disabled={(currentList.pets || 0) <= 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <span>{currentList['pets']}</span>

            <IconButton
              size="small"
              onClick={(e) => handleCountChange(e, 'pets', +1)}
              disabled={(currentList.pets || 0) > stay.capacity}
            >
              <AddIcon fontSize="small" />
            </IconButton>

          </Box>


        </MenuItem>
      </Menu>
    </div>
  );
}
