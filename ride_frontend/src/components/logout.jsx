import { signOut } from "firebase/auth";
import auth from "../firebaseConfig";

const handleLogout = async (navigate, setUser) => {
  try {
    setUser(null);
    await signOut(auth);
    navigate("/");
  } catch (error) {
    console.error("Logout Failed:", error);
    navigate("/home");
  }
};

export default handleLogout;
