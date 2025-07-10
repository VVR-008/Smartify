const express = require('express');
const router = express.Router();
const {UserDetails} = require('../model/User');

router.post("/newdevice", async (req, res) => {
    const { email, devicedata } = req.body;
    try {
        const user = await UserDetails.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.devices.push(devicedata);
        await user.save();
        res.status(200).json({ message: "Device added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding device" });
    }
});

router.post("/newroom", async (req, res) => {
    const { email, room } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.rooms.push(room);
        await user.save();
        res.status(200).json({ message: "Room added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error setting up room" });
    }
});

router.post('/deletedevice', async (req, res) => {
    const { email, device } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (user) {
            user.devices.pull({ deviceid: device });
            await user.save();
            res.status(200).json({ message: "Device removed successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting device" });
    }
    
});

router.post('/updatedevice', async (req, res) => {
    const { email, deviceData} = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateuser = await UserDetails.updateOne(
            { email: email, 'devices.deviceid': deviceData.deviceid },
            { $set: { 'devices.$': deviceData } }
        );

        if (updateuser.modifiedCount === 0) {
            return res.status(404).json({ message: 'Device not found or no update needed' });
        }
        res.status(200).json({ message: 'Device data updated successfully' });
    } catch (error) {
        console.error('Error updating device data:', error);
        res.status(500).json({ message: 'An error occurred while updating the device data' });
    }
});

router.post('/guest', async (req, res) => {
    const { email, data } = req.body;
    console.log(email);
  
    try {
      const user = await UserDetails.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      user.guests.push(data);
      await user.save();
      res.status(201).json({ message: "Guest added successfully", guests: user.guests });
    } catch (error) {
      console.error("Error adding guest:", error);
      res.status(500).json({ message: "Failed to add guest", error: error.message });
    }
  });
  

module.exports = router;
