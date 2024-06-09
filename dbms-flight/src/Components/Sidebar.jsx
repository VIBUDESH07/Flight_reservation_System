import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SupportIcon from '@mui/icons-material/Support';
import MenuIcon from '@mui/icons-material/Menu';
import './Sidebar.css';

const Sidebar = () => {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box className="profile-section" sx={{ padding: '1rem', textAlign: 'center' }}>
        <AccountCircleIcon sx={{ fontSize: 50 }} />
        <Typography variant="h6">User</Typography>
        <Typography variant="body2">Gold Member</Typography>
      </Box>
      <Divider />
      <List>
        {[
          { text: 'Home', icon: <HomeIcon /> },
          { text: 'Book Flight', icon: <FlightTakeoffIcon /> },
          { text: 'My Trips', icon: <TripOriginIcon /> },
          { text: 'Check-in', icon: <LocationOnIcon /> },
          { text: 'Flight Status', icon: <InboxIcon /> },
          { text: 'Support', icon: <SupportIcon /> }
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ padding: '2rem'}}>
        <Button class="login" variant="contained" color="primary">
          Log In
        </Button>
      </Box>
    </Box>
  );

  return (
    <div className="sidebar">
      <Button onClick={toggleDrawer('left', true)}>
        <MenuIcon />
      </Button>
      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
    </div>
  );
};

export default Sidebar;
