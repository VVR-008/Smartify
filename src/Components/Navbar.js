import React, { useState } from 'react';
import { Devices, Dashboard,Menu as MenuIcon ,PeopleAltOutlined} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, ListItemIcon, Divider, IconButton } from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useUser } from '../Context/UserContext';

function NavBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility
  const open = Boolean(anchorEl);
  const {logout} = useUser();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => navigate("/dashboard");
  const handleDevices = () => navigate("/devices");
  const handleSettings = () => navigate("/settings");
  const handleUsers = () => navigate("/users");
  const handleLogout = () => {
    logout()
    navigate('/');
  }

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState); // Toggle the sidebar visibility
  }

  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary text-white px-4 py-2 shadow-sm fixed-top">
        <div className='d-flex gap-2 p-0'>
          <img
            src={require("../Assets/smarthome.png")}
            alt="Weather Icon"
            className="mb-1"
            style={{width:"30px",height:"30px"}}
          />
          <h3 style={{ color: "black" }}>Smartify</h3>
        </div>

        {/* Navbar Toggler Button for Small Screens */}
        <button
          className="navbar-toggler border-0"
          onClick={toggleSidebar} // Toggle sidebar visibility
          aria-expanded={sidebarOpen ? "true" : "false"}
        >
          <MenuIcon/>
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${sidebarOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto" style={{ cursor: "pointer" }}>
            <li className="nav-item me-3">
              <span className="nav-link fs-6" onClick={handleDashboard}>
                <Dashboard fontSize="small" /> Dashboard
              </span>
            </li>
            <li className="nav-item me-3" onClick={handleDevices}>
              <span className="nav-link fs-6">
                <Devices fontSize="small" /> Devices
              </span>
            </li>
            <li className="nav-item me-3" onClick={handleUsers}>
              <span className="nav-link fs-6">
                <PeopleAltOutlined fontSize="small" /> Users
              </span>
            </li>
            <li className="nav-item">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 30, height: 30 }} />
              </IconButton>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar Menu (for smaller screens) */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="nav-link fs-6" onClick={handleDashboard}>
                <Dashboard fontSize="small" /> Dashboard
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link fs-6" onClick={handleDevices}>
                <Devices fontSize="small" /> Devices
              </span>
            </li>
            <li className="nav-item fs-6">
              <span className="nav-link" onClick={handleSettings}>
                <Settings fontSize="small" /> Settings
              </span>
            </li>
            <li className="nav-item fs-6">
              <span className="nav-link" onClick={handleLogout}>
                <Logout fontSize="small" /> Logout
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Account Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Divider/>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavBar;
