import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../Context/UserContext";
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';

const GoogleAuthComponent = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const googleAuth = async (response) => {
    try {
      const token = response.credential;


      const res = await fetch("http://localhost:8080/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        const { user,authtoken } = data;

        if (data.success) {
          Cookies.set('authToken', authtoken, { expires: 7 });
          Cookies.set('user', JSON.stringify(user), { expires: 7 });
          setUser(user);
          navigate("/dashboard");
        } else {
          toast.error("Google login failed.");
        }
      } else {
        toast.error("Failed to login with Google.");
      }
    } catch (error) {
      toast.error("An error occurred during Google login.");
      console.error(error);
    }
  };

  return (
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onSuccess={googleAuth}
        onFailure={googleAuth}
        buttonText="Login with Google"
        cookiePolicy={"single_host_origin"}
      />
  );
};

export default GoogleAuthComponent;
