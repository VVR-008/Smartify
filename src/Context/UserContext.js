import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const loadUserData = () => {
    const savedUserData = Cookies.get('user');
    const savedToken = Cookies.get('authToken');

    const guestSaveData = Cookies.get('user');
    const guestSaveToken = Cookies.get('guestToken');
    
    if (savedUserData && savedToken) {
      try {
        return { ...JSON.parse(savedUserData), authToken: savedToken };
      } catch (e) {
        Cookies.remove('user');
        Cookies.remove('authToken');
      }
    }else if(guestSaveData && guestSaveToken){
      try{
        return { ...JSON.parse(savedUserData), authToken: savedToken }
      }catch(e){
        Cookies.remove('user');
        Cookies.remove('guestToken');
      }
    }
  };

  const loadRole = () =>{
    const role = Cookies.get('role');
    if (role){
      return true;
    }
  }

  const [user, setUser] = useState(loadUserData);
  const [isGuest,setGuest] = useState(loadRole);

  useEffect(() => {
    if (user && user.authToken) {
      console.log("Hello");
      Cookies.set('user', JSON.stringify(user), { expires: 7 });

      Cookies.set('authToken', user.authToken, { expires: 7 });
    }
  }, [user]);


  const logActivity = (action) => {
    setUser((prev) => ({
      ...prev,
      activitylog: [...prev.activitylog, action],
    }));
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    Cookies.remove('authToken');
    Cookies.remove('guestToken');
    Cookies.remove('role');
    setGuest(false);
  };

  const newDevice = (device) => {
    setUser((prev) => ({
      ...prev,
      devices: [...prev.devices, device],
    }));
  };

  const newRoom = (room) => {
    setUser((prev) => ({
      ...prev,
      rooms: [...prev.rooms, room],
    }));
  };

  const removeDevice = (deviceId) => {
    setUser((prev) => ({
      ...prev,
      devices: prev.devices.filter(device => device.deviceid !== deviceId),
    }));
  };

  const updateDevice = (deviceId, updatedDevice) => {
    setUser((prev) => ({
      ...prev,
      devices: prev.devices.map((device) =>
        device.deviceid === deviceId ? { ...device, ...updatedDevice } : device
      ),
    }));
  };

  const guestUser = (user) =>{
    setUser((prev) =>({
      ...prev,
      guests: [...prev.guests,user]
    }))
  }

  const authenticateUser = (token, userData) => {
    setUser({ ...userData, authToken: token });
    Cookies.set('authToken', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
  };
  

  return (
    <UserContext.Provider value={{ user, isGuest, setUser, setGuest, authenticateUser, logout, newDevice, newRoom, removeDevice, updateDevice, logActivity, guestUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
