import React from "react";

function PowerUsage() {

    return (
        <div className="col-12 col-md-4 mb-3 d-flex align-items-stretch">
            <div className="card shadow custom-back border-0 w-100">
                <div className="d-flex align-items-center justify-content-center gap-3 rounded-3 p-3 text-white">
                        <img
                            src={require("../Assets/dial.png")}
                            alt="Weather Icon"
                            className="mb-1"
                            style={{width:"80px", height:"80px"}}

                        />
                    <div className="border border-light" style={{ height: '100px', width: '1px' }} />
                    <div className="d-flex flex-column align-items-start">
                        <span className="text-sm">Power Usage</span>
                        <span className="fs-1 fw-bold">1.0</span>
                        <span className="text-sm">KWH</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PowerUsage;