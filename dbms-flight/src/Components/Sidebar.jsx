import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/Sidebar.css'
const Sidebar = ({ open, toggleSidebar }) => {
  const location = useLocation();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleSidebar(false)}
    >
      <Box
        className="sidebar"
        role="presentation"
        onClick={toggleSidebar(false)}
        onKeyDown={toggleSidebar(false)}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/" className={location.pathname === '/' ? 'active-link' : ''}>
              <ListItemIcon className="list-item-icon">
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Home" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <Divider className="divider" />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/passenger" className={location.pathname === '/passenger' ? 'active-link' : ''}>
              <ListItemIcon className="list-item-icon">
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Passenger" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/fetch" className={location.pathname === '/fetch' ? 'active-link' : ''}>
              <ListItemIcon className="list-item-icon">
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Flight Details" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <Divider className="divider" />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin" className={location.pathname === '/admin' ? 'active-link' : ''}>
              <ListItemIcon className="list-item-icon">
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" className="list-item-text" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/add" className={location.pathname === '/add' ? 'active-link' : ''}>
              <ListItemIcon className="list-item-icon">
                <MailIcon />
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
