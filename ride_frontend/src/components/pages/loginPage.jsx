import { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import auth from "../../firebaseConfig";
import { useAuth } from "../../authContext";

const provider = new GoogleAuthProvider();

const Login = () => {
  const { user } = useAuth();  
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const route = location.state?.route || "/home";
   

  useEffect(() => {
    if (user) navigate(route); // Redirect if already logged in
  }, [user, navigate]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email.endsWith("@iiti.ac.in")) {
        navigate(route);
      } else {
        setError("Only @iiti.ac.in emails are allowed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Failed to sign in. Try again.");
    }
  };

  return (
    <div
      className="loginPage"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="outlined"
        onClick={signInWithGoogle}
        startIcon={<FcGoogle />}
      >
        Sign in with Institute ID
      </Button>
    </div>
  );
};

export default Login;
