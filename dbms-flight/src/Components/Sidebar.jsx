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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import SupportIcon from '@mui/icons-material/Support';
import SettingsIcon from '@mui/icons-material/Settings';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import './Sidebar.css';

const Sidebar = () => {
  const [state, setState] = React.useState({
    left: false,
  });
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box className="profile-section" sx={{ padding: '1rem', textAlign: 'center' }}>
        <AccountCircleIcon sx={{ fontSize: 50 }} />
        <Typography variant="h6">John Doe</Typography>
        <Typography variant="body2">Gold Member</Typography>
      </Box>
      <Divider />
      <List>
        {[
          { text: 'Home', icon: <InboxIcon /> },
          { text: 'Book Flight', icon: <FlightTakeoffIcon /> },
          { text: 'My Trips', icon: <TripOriginIcon /> },
          { text: 'Check-in', icon: <InboxIcon /> },
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
      <Box className="search-container" sx={{ padding: '1rem' }}>
        <TextField 
          variant="outlined"
          placeholder="Search flights..."
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Upcoming Trips" />
        </ListItem>
        <Divider />
        {['Trip to New York', 'Trip to London'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Settings" />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Account Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Privacy Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Loyalty Program" />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LoyaltyIcon />
            </ListItemIcon>
            <ListItemText primary="Redeem Points" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LoyaltyIcon />
            </ListItemIcon>
            <ListItemText primary="View Benefits" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ padding: '1rem', textAlign: 'center' }}>
        <Typography>Dark Mode</Typography>
        <Switch checked={isDarkMode} onChange={toggleDarkMode} />
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
