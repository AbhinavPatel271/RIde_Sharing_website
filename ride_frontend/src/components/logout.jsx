import { signOut } from "firebase/auth";
import auth from "../firebaseConfig";

const handleLogout = async (navigate, setUser) => {
  try {
    setUser(null);
    await signOut(auth);        // if the logout is successful , then the user a redirected to the login page
    navigate("/");     
  } catch (error) {
    console.error("Logout Failed:", error);
    navigate("/home");
  }
};

export default handleLogout;
