import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, InputLabel, FormControl, TextField } from "@mui/material";
import { useUser } from "../Context/UserContext";
import { useWebSocket } from "../Context/WebSocketContext";

function PopUp(props) {
    const { user, newDevice, newRoom } = useUser();
    const { messages } = useWebSocket();

    const [activeStep, setActiveStep] = useState("Start");
    const [room, setRoom] = useState({ name: "" });
    const [devicedata, setDeviceData] = useState({
        deviceid: "",
        devicename: "",
        location: "",
        devicetype: "Light",
        status: false,
    });
    const [deviceList, setDeviceList] = useState([]);


    useEffect(() => {
        if (messages) {
            console.log('Received messages:', messages);
    
            if (messages.type === "DEVICE_LIST" && Array.isArray(messages.devices)) {
                console.log('Devices:', messages.devices);
    
                setDeviceList((prev) => {
                    const updatedList = [...prev, ...messages.devices];
                    const uniqueList = updatedList.filter((device, index, self) =>
                        index === self.findIndex((d) => d.deviceid === device.deviceid)
                    );
                    return uniqueList;
                });
            } else {
                console.log('Invalid device list or type:', messages.type);
            }
        } else {
            console.log('Messages is undefined or null');
        }
    }, [messages]);
    
    

    const handleSave = async (e) => {
        e.preventDefault();
        if (activeStep === "Device") {
            try {
                const response = await fetch(`${process.env.REACT_APP_URL}/api/user/newdevice`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, devicedata: devicedata })
                });
                if (response.ok) {
                    newDevice(devicedata);
                    props.onCancel();
                    setActiveStep('Start');
                }
            } catch (error) {
                console.log(error);
            }
        } else if (activeStep === "Room") {
            try {
                const response = await fetch(`${process.env.REACT_APP_URL}/api/user/newroom`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, room: room })
                });
                if (response.ok) {
                    newRoom(room);
                    props.onCancel();
                    setActiveStep('Start');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleBack = () => {
        setActiveStep("Start");
    };

    const handleCancel = () => {
        props.onCancel();
    };

    const renderRoomSetup = () => (
        <form onSubmit={handleSave}>
            <div className="mb-3">
                <TextField
                    label="Room Name"
                    variant="outlined"
                    fullWidth
                    value={room.name}
                    onChange={(e) => setRoom((prev) => ({ ...prev, name: e.target.value }))}
                />
            </div>
        </form>
    );

    const renderDeviceSetup = () => (
        <form onSubmit={handleSave}>
            <div className="mb-3">
                <FormControl fullWidth>
                    <InputLabel id="deviceID-label">Device ID</InputLabel>
                    <Select
                        labelId="deviceID-label"
                        id="deviceID"
                        value={devicedata.deviceid}
                        onChange={(e) => setDeviceData((prev) => ({ ...prev, deviceid: e.target.value }))}
                        label="Device ID"
                    >
                        <MenuItem value="">Choose a device...</MenuItem>
                        {deviceList.length > 0 ? (
                            deviceList.map((device) => (
                                <MenuItem key={device.deviceid} value={device.deviceid}>
                                    {device.deviceid}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No devices available</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </div>

            <div className="mb-3">
                <TextField
                    label="Device Name"
                    variant="outlined"
                    fullWidth
                    value={devicedata.devicename}
                    onChange={(e) => setDeviceData((prev) => ({ ...prev, devicename: e.target.value }))}
                />
            </div>

            <div className="mb-3">
                <FormControl fullWidth>
                    <InputLabel id="selectRoom-label">Select Room</InputLabel>
                    <Select
                        labelId="selectRoom-label"
                        id="selectRoom"
                        value={devicedata.location}
                        onChange={(e) => setDeviceData((prev) => ({ ...prev, location: e.target.value }))}
                        label="Select Room"
                    >
                        <MenuItem value="">Choose a room...</MenuItem>
                        {user.rooms.map((room) => (
                            <MenuItem key={room.name} value={room.name}>
                                {room.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="mb-3">
                <FormControl fullWidth>
                    <InputLabel id="selectDeviceType-label">Device Type</InputLabel>
                    <Select
                        labelId="selectDeviceType-label"
                        id="selectDeviceType"
                        value={devicedata.devicetype}
                        onChange={(e) => setDeviceData((prev) => ({ ...prev, devicetype: e.target.value }))}
                        label="Device Type"
                    >
                        <MenuItem value="Light">Light</MenuItem>
                        <MenuItem value="Air Conditioner">Air Conditioner</MenuItem>
                        <MenuItem value="Fan">Fan</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </form>
    );

    const getDialogTitle = () => {
        if (activeStep === "Start") return "Choose Option";
        if (activeStep === "Room") return "Setup Room";
        if (activeStep === "Device") return "Setup Device";
    };

    return (
        <Dialog open={props.value} maxWidth="sm" fullWidth>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogContent>
                {activeStep === "Start" && (
                    <div>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => setActiveStep("Room")}
                        >
                            Create New Room
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => setActiveStep("Device")}
                            style={{ marginTop: "8px" }}
                        >
                            Setup New Device
                        </Button>
                    </div>
                )}
                {activeStep === "Room" && renderRoomSetup()}
                {activeStep === "Device" && renderDeviceSetup()}
            </DialogContent>

            <DialogActions>
                {activeStep !== "Start" && (
                    <Button onClick={handleBack} color="secondary">
                        Back
                    </Button>
                )}
                {activeStep === "Room" && (
                    <Button onClick={handleSave} color="primary">
                        Save Room
                    </Button>
                )}
                {activeStep === "Device" && (
                    <Button onClick={handleSave} color="primary">
                        Save Device
                    </Button>
                )}
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PopUp;
