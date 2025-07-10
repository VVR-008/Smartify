import React, { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { TextField, Button } from '@mui/material';
import { useUser } from "../Context/UserContext";
import { toast,Slide, ToastContainer } from 'react-toastify';
import Footer from "../Components/Footer";

function Settings() {
  const { user } = useUser();
  const [passDetails, setpassDetails] = useState({ current: "", newpass: "", confi: "" });

  const [isLoaded,setIsLoaded] = useState(false);
  useEffect(()=>{
    setIsLoaded(true);
  },[]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (passDetails.newpass === passDetails.confi && user.password === passDetails.current) {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/auth/changepassword`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, password: user.password, newpass: passDetails.newpass })
        });
        if (response.ok) {
          toast.success("Password Changed Successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            transition:Slide
          });
          setpassDetails({ current: "", newpass: "", confi: "" });
        } else {
          toast.error("Failed to update password. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });
        }
      } else {
        toast.error("Invalid password or mismatch.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          transition:Slide
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        transition:Slide
      });
    }
  };

  return (
    <main className={`d-flex flex-column min-vh-100 fade-in ${isLoaded?"visible":""}`}>
      <div className="container mt-4 pt6 flex-grow-1">
        <ToastContainer />
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5 className="card-title mb-3" style={{ fontSize: '1.5rem' }}>User Information</h5>
                <div className="mb-3" style={{ fontSize: '1.2rem' }}>
                  <AccountCircleIcon /> <strong>Username:</strong> {user.username}
                </div>
                <div className="mb-3" style={{ fontSize: '1.2rem' }}>
                  <EmailIcon /> <strong>Email:</strong> {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5 className="card-title mb-4">Change Password</h5>
                <form>
                  <div className="mb-4">
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      required
                      variant="standard"
                      value={passDetails.current}
                      onChange={(e) => setpassDetails((prev) => ({ ...prev, current: e.target.value }))} />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      required
                      variant="standard"
                      value={passDetails.newpass}
                      onChange={(e) => setpassDetails((prev) => ({ ...prev, newpass: e.target.value }))} />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      required
                      variant="standard"
                      value={passDetails.confi}
                      onChange={(e) => setpassDetails((prev) => ({ ...prev, confi: e.target.value }))} />
                  </div>
                  <div className="mt-4">
                  <Button variant="text" sx={{color:"black"}} onClick={handleUpdate}>
                    Update Password
                  </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <Footer/>
    </main>
  );
}

export default Settings;