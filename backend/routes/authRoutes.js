const express = require('express');
const router = express.Router();
const {UserDetails} = require('../model/User');
const { setToken } = require('./auth');
const { OAuth2Client } = require("google-auth-library");
require('dotenv').config();

router.post("/signup", async (req, res) => {

    const { username, email, password } = req.body;
    console.log(username,email,password)
    try {
        const user = new UserDetails({ username, email, password });
        await user.save();
        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing up" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await UserDetails.findOne({ email });
        if (admin) {
            if (email === admin.email && password === admin.password) {
                const token = setToken({ username: admin.username, email: admin.email });
                return res.json({ authtoken:token,user:admin, role: 'admin' });
            }
        }
        const guest = await UserDetails.findOne({ "guests.email": email,"guests.password":password });
        if (guest) {
            const guestData = guest.guests.find(g => g.email === email);
            const token = setToken({ username: guestData.name, email: guestData.email });
            return res.json({ guestToken:token,user:guest, role: 'guest',name:guestData.name });
        }

        return res.status(400).json({ message: 'Email not authorized' });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});


router.post('/changepassword', async (req, res) => {
    const { email, password, newpass } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        user.password = newpass;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the password' });
    }
});

const client = new OAuth2Client(process.env.GOOGLE_AUTH_API);

router.post("/google-login", async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "Token not provided" });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_AUTH_API,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        let user = await UserDetails.findOne({ email });
        if (user) {
            const jwttoken = setToken({ username: user.username, email: user.email });
            return res.json({ success: true, user,authtoken:jwttoken});
        }
        
        const password = 'googleLogin123'
        user = new UserDetails({ username: name, email,password });
        await user.save();
        const jwttoken = setToken({ username: user.username, email: user.email });
        res.json({ success: true, user,authtoken:jwttoken });
    } catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(401).json({ success: false, error: "Invalid token" });
    }
});

module.exports = router;