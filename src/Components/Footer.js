import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "1.0.0";

  return (
    <footer className="text-dark border-0 mt-auto">
      <div className="card border-0 shadow w-100">
        <div className="card-body">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="small">&copy; {currentYear} All Rights Reserved</div>
            <div className="small">Version {appVersion}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
