import React from 'react';
import { useUser } from '../Context/UserContext';

export default function RecentActivity() {
  const { user } = useUser();

  const latestActivities = user.activitylog.slice(-3).reverse();

  return (
    <div className="card mb-4 border-0 shadow">
      <div className="card-body">
        <h5 className="d-flex align-items-center">Recent Activity</h5>
        <small className='text-muted'>Latest events from your automation system.</small>
        <div className="mt-3">
          {user.activitylog.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center">
              <h4>No Recent Activity</h4>
            </div>
          ) : (
            latestActivities.map((activity, index) => (
              <div key={index} className="d-flex align-items-center mb-3 gap-3">
                <img 
                  src={require('../Assets/history.png')}
                  alt="Recent Activity Icon" 
                  className="w-25"
                  style={{ maxWidth: '30px', maxHeight: '30px' }}
                />
                <div className="ml-3">
                  <p className="mb-0 font-weight-bold">{activity.action}</p>
                  <small className="text-muted">{activity.timestamp}</small>
                </div>
                <hr className="my-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
