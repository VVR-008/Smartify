import React from 'react';

const QuickActions = () => {
  return (
    <section className="mb-5">
      <h3 className="h5 fw-semibold mb-4">Quick Actions</h3>
      <div className="row">
        {/* Action 1 - All Lights On */}      
        <div className="col-6 col-md-3 mb-3">
          <div
            className="card border-0 shadow text-center py-2 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: '#e5e7eb',
              height: '90px',
              borderRadius: "0"
            }}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="text-sm" style={{ fontSize: '16px' }}>All Lights On</span>
            </div>
          </div>
        </div>

        {/* Action 2 - All Lights Off */}
        <div className="col-6 col-md-3 mb-3">
          <div
            className="card border-0 shadow text-center py-2 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: '#e5e7eb',
              height: '90px',
              borderRadius: "0"
            }}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="text-sm" style={{ fontSize: '16px' }}>All Lights Off</span>
            </div>
          </div>
        </div>

        {/* Action 3 - Sync Devices */}
        <div className="col-6 col-md-3 mb-3">
          <div
            className="card border-0 shadow text-center py-2 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: '#e5e7eb',
              height: '90px',
              borderRadius: '0'
            }}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="text-sm" style={{ fontSize: '16px' }}>Sync Devices</span>
            </div>
          </div>
        </div>

        {/* Action 4 - Update Firmware */}
        <div className="col-6 col-md-3 mb-3">
          <div
            className="card border-0 shadow text-center py-2 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: '#e5e7eb',
              height: '90px',
              borderRadius: "0"
            }}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="text-sm" style={{ fontSize: '16px' }}>Update Firmware</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
