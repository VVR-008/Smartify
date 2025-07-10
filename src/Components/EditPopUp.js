import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useUser } from "../Context/UserContext";

function UpdateDevicePopUp(props) {
    const { user, updateDevice } = useUser();

    const [deviceData, setDeviceData] = useState({
        deviceid:props.did,
        devicename: "",
        location: "",
        devicetype: "Light",
    });

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(deviceData)
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}api/user/updatedevice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    deviceData: deviceData,
                }),
            });
            if (response.ok) {
                updateDevice(deviceData.deviceid,deviceData)
            }
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    const handleCancel = () => {
        props.onClose();
    };

    return (
        <Dialog open={props.value} maxWidth="sm" fullWidth>
            <DialogTitle>Update Device</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSave}>
                    <div className="mb-3">
                        <label htmlFor="deviceName" className="form-label">
                            Device Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Device Name"
                            value={deviceData.devicename}
                            onChange={(e) => setDeviceData({ ...deviceData, devicename: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="selectRoom" className="form-label">
                            Select Room
                        </label>
                        <select
                            id="selectRoom"
                            className="form-select"
                            value={deviceData.location}
                            onChange={(e) => setDeviceData({ ...deviceData, location: e.target.value })}
                        >
                            <option value="">Choose a room...</option>
                            {user.rooms.map((room) => (
                                <option key={room.name} value={room.name}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="selectDeviceType" className="form-label">
                            Device Type
                        </label>
                        <select
                            id="selectDeviceType"
                            className="form-select"
                            value={deviceData.devicetype}
                            onChange={(e) => setDeviceData({ ...deviceData, devicetype: e.target.value })}
                        >
                            <option value="Light">Light</option>
                            <option value="Air Conditioner">Air Conditioner</option>
                            <option value="Fan">Fan</option>
                        </select>
                    </div>
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSave} color="primary">
                    Save Changes
                </Button>
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateDevicePopUp;
