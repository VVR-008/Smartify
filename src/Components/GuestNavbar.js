import React, { useState } from 'react';
import { Dashboard, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';
import { useUser } from '../Context/UserContext';

function GuestNavbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {logout} = useUser();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => navigate("/dashboard");
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary text-white px-4 py-2 shadow-sm fixed-top">
        <div className='d-flex gap-2 p-0'>
          <img src={require("../Assets/smarthome.png")} alt="Weather Icon" className="mb-1" style={{ width: "30px", height: "30px" }} />
          <h3 style={{ color: "black" }}>Smartify</h3>
        </div>

        <button className="navbar-toggler border-0" onClick={toggleSidebar} aria-expanded={sidebarOpen ? "true" : "false"}>
          <MenuIcon />
        </button>

        <div className={`collapse navbar-collapse ${sidebarOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto" style={{ cursor: "pointer" }}>
            <li className="nav-item me-3">
              <span className="nav-link fs-6" onClick={handleDashboard}>
                <Dashboard fontSize="small" /> Dashboard
              </span>
            </li>
            <li className="nav-item">
              <IconButton onClick={handleClick} size="small" aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
                <Avatar sx={{ width: 30, height: 30 }} />
              </IconButton>
            </li>
          </ul>
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="nav-link fs-6" onClick={handleDashboard}>
                <Dashboard fontSize="small" /> Dashboard
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

      <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose} slotProps={{ paper: { elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5 }}}}>
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" /> Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default GuestNavbar;