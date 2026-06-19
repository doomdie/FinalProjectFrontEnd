import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

export function GuestMenu({ currentList, onUpdateList }) {
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
function handleEditAction(keyName) {

        onUpdateList({
            ...currentList,
            [keyName]: currentList[keyName] + 1
        });
    
}


  return (
    <div>
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
      >
        <MenuItem onClick={() => handleEditAction('adults')}>
          Edit Profile
        </MenuItem>
        
  
      </Menu>
    </div>
  );
}