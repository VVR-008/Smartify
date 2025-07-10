    const mongoose = require('mongoose');

    const DeviceSchema = new mongoose.Schema({
        deviceid: {type:String},
        devicename: { type: String},
        location: { type: String},
        devicetype: { type: String},
    });

    const RoomSchema = new mongoose.Schema({
        name: { type: String}
    });

    const ActivitySchema = new mongoose.Schema({
        action:{type: String},
        timestamp:{type:Date,default:Date.now}
    });

    const GuestSchema = new mongoose.Schema({
        name: { type: String },
        email: { type: String, unique: true },
        password: {type:String}
    })

    const UserSchema = new mongoose.Schema({
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        googleId: {type: String},
        rooms: [RoomSchema],
        devices: [DeviceSchema],
        activitylog:[ActivitySchema],
        guests:[GuestSchema]
    });

    const UserDetails = mongoose.model("UserDetails", UserSchema);

    module.exports = {UserDetails};