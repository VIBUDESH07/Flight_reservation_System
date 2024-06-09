import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import FlightIcon from '@mui/icons-material/Flight';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../Styles/Sidebar.css';

const Sidebar = ({ open, toggleSidebar, role = "User" }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleSidebar(false)}
    >
      <Box
        className="side-bar"
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleSidebar(false)}
        onKeyDown={toggleSidebar(false)}
      >
        <List className="sidebar">
          <ListItem className="profile-section">
            <ListItemIcon className="profile-icon">
              <AccountCircleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={role} className="role-text" />
          </ListItem>
          <Divider className="divider" />
          <ListItem disablePadding className="list-item">
            <ListItemButton component={Link} to="/"> {/* Navigate to Home */}
              <ListItemIcon className="list-item-icon">
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <Divider className="divider" />
          <ListItem disablePadding className="list-item">
            <ListItemButton component={Link} to="/passenger"> {/* Navigate to Passenger page */}
              <ListItemIcon className="list-item-icon">
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Passenger" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="list-item">
            <ListItemButton component={Link} to="/fetch"> {/* Navigate to Flight Details page */}
              <ListItemIcon className="list-item-icon">
                <FlightIcon />
              </ListItemIcon>
              <ListItemText primary="Flight Details" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <Divider className="divider" />
          <ListItem disablePadding className="list-item">
            <ListItemButton component={Link} to="/admin"> {/* Navigate to Admin page */}
              <ListItemIcon className="list-item-icon">
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding className="list-item">
            <ListItemButton component={Link} to="/add"> {/* Navigate to Add page */}
              <ListItemIcon className="list-item-icon">
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Add" className="list-item-text" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
