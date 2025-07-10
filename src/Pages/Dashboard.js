import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box } from '@mui/material';
import Light from "../Components/Light";
import Fan from "../Components/Fan";
import AC from "../Components/AC";
import CustomTabPanel from '../Components/CustomTab';
import Temperature from "../Components/Temperature";
import Humidity from "../Components/Humidity";
import { useUser } from "../Context/UserContext";
import RecentActivity from "../Components/RecentActivity"
import QuickActions from "../Components/QuickActions";
import PowerUsage from "../Components/PowerUsage";
import Footer from "../Components/Footer";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

function Dashboard() {
  const [value, setValue] = useState(0);
  const { user,isGuest } = useUser();
  const [guestName, setGuestName] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (isGuest) {
      const token = Cookies.get("guestToken");
      if (token) {
        const decoded = jwtDecode(token);
        setGuestName(decoded.username);
      }
    }
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <main className={`fade-in ${isLoaded ? "visible" : ""}`}>
      <div className="container mt-4 pt6">

      <section>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h2 className="fw">
              Hello, {
                isGuest ?guestName:user.username
              }!
            </h2>
            <p>Welcome back to your home</p>
          </div>
        </div>
      </section>

        <section>
          <div>
            <div className="row mt-4">
              <Temperature />
              <Humidity />
              <PowerUsage />
            </div>
          </div>
        </section>

        <section>
          <div className="row">
            <div className="col-12 mb-3">
              <div className="card border-0 shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">Your Rooms</h5>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between">
                      <Box sx={{ maxWidth: { xs: 320, sm: 287 }, bgcolor: 'background.paper', p: 0 }}>
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          variant="scrollable"
                          scrollButtons={false}
                          aria-label="scrollable auto tabs example"
                          sx={{ minHeight: "28px", p: 0 }}
                          style={{ backgroundColor: "#EEEDEB" }}
                        >
                          <Tab label="All devices" sx={{ minHeight: "28px", textTransform: 'none', fontSize: "15px", p: 1 }} />
                          {user.rooms.map((room) => {
                            return <Tab label={room.name} sx={{ minHeight: "28px", textTransform: 'none', fontSize: "15px", p: 1 }} />;
                          })}
                        </Tabs>
                      </Box>
                    </div>
                    <CustomTabPanel value={value} index={0}>
                      <div className="row mt-4">
                        {user.devices.length === 0 ? (
                          <div className="d-flex justify-content-center align-items-center">
                            <h4>No devices found</h4>
                          </div>
                        ) : (
                          user.devices.map((device) => {
                            if (device.devicetype === "Light") {
                              return <Light name={device.devicename} id={device.deviceid} />;
                            } else if (device.devicetype === "Fan") {
                              return <Fan name={device.devicename} id={device.deviceid}/>;
                            } else if (device.devicetype === "Air Conditioner") {
                              return <AC name={device.devicename} id={device.deviceid}/>;
                            }
                            return null;
                          })
                        )}
                      </div>
                    </CustomTabPanel>
                    {user.rooms.map((room, index) => (
                      <CustomTabPanel value={value} index={index + 1} key={room.name}>
                        <div className="row mt-4">
                          {user.devices.filter(device => device.location === room.name).map((device) => {
                            if (device.devicetype === "Light") {
                              return <Light key={device.id} name={device.devicename} id={device.deviceid} />;
                            } else if (device.devicetype === "Fan") {
                              return <Fan key={device.id} name={device.devicename} id={device.deviceid}/>;
                            } else if (device.devicetype === "Air Conditioner") {
                              return <AC key={device.id} name={device.devicename} id={device.deviceid}/>;
                            }
                            return (
                              <div className="d-flex justify-content-center align-items-center" key={device.id}>
                                <h4>No devices found in {room.name}</h4>
                              </div>
                            );
                          })}
                        </div>
                      </CustomTabPanel>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <RecentActivity />
        </section>

        <section>
          <QuickActions />
        </section>

      </div>
      <Footer />
    </main>
  );
}

export default Dashboard;
