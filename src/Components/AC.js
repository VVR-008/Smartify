import React, { useState } from "react";
import { Remove, Add, PowerSettingsNew} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useWebSocket } from "../Context/WebSocketContext";

function AC(props) {
    const [temperature, setTemperature] = useState(22);
    const [powerOn, setPowerOn] = useState(false);
    const {sendMessage} = useWebSocket();

    const handlePower = () => {
        setPowerOn(prevPowerOn => !prevPowerOn);
        sendMessage(JSON.stringify({
            type: "AC_CONTROL",
            deviceid: props.id,
        }));
    }


    return (
        <div className="col-12 col-sm-6 col-md-3 mb-3 d-flex align-items-stretch">
            <div className="card border h-100 w-100">
                <div className="card-body">
                    <h6 className="card-title" style={{ fontSize: '1.25rem' }}>{props.name}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0" style={{ fontSize: '1.1rem' }}>Power</p>
                        <IconButton onClick={handlePower}>
                            <PowerSettingsNew fontSize="large" color={powerOn ? "success" : "action"} />
                        </IconButton>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0 me-2">Temp:</p>
                        <div>
                            <IconButton 
                                size="small" 
                                style={{ fontSize: '0.875rem' }}
                                onClick={()=>setTemperature(prevTemp => Math.max(prevTemp - 1, 16))}>
                                <Remove fontSize="small" />
                            </IconButton>
                            <span className="mx-1">{temperature}°</span>
                            <IconButton 
                                size="small" 
                                style={{ fontSize: '0.875rem' }}
                                onClick={()=>setTemperature(prevTemp => Math.min(prevTemp + 1, 30))}>
                                <Add fontSize="small" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AC;