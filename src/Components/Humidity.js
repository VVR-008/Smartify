import React, { useEffect, useState } from "react";

function Humidity(){

    const [humidity,sethumidity] = useState();

    useEffect(()=>{
        const fetchData = async () =>{
            try {
                const response = await fetch('http://localhost:8080/api/humidity',{method:'GET'});
                if(response.ok){
                    const data = await response.json();
                    sethumidity(data.humidity);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    },[]);

    return(
        <div className="col-12 col-md-4 mb-3 d-flex align-items-stretch">
            <div className="card shadow custom-back border-0 w-100">
            <div className="d-flex align-items-center justify-content-center gap-3 rounded-3 p-3 text-white">
                <img
                    src={require("../Assets/humidity.png")}
                    alt="Weather Icon"
                    className="mb-1"
                    style={{width:"90px",height:"90px"}}
                />
                <div className="border border-light" style={{ height: '100px', width: '1px' }} />
                <div className="d-flex flex-column align-items-start">
                    <span className="text-sm">Humidity</span>
                    <span className="fs-1 fw-bold">{humidity}%</span>
                    <span className="text-sm">Optimal Level</span>
                </div>
            </div></div>
        </div>
    );
}
export default Humidity;