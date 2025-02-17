import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { Badge } from "@mui/material";
import ProfileDropdown from "./profileDropdown";

function Navbar(props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div>
        <div
          style={{
            width: "100%",
            height: "60px",
            backgroundColor: "#A1E1E9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <HomeIcon
              sx={{ fontSize: "45px", color: "#f5e6e6", margin:'5px 0px 0px 15px' , cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginRight: "20px" }}>
            <Badge
              badgeContent={props.numNotification}
              color="info"
              sx={{ marginBottom: "px" }}
            >
              <InfoIcon
                sx={{
                  fontSize: "40px",
                  color: "#f5e6e6",
                  marginTop: "4px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/requests")}
              />
            </Badge>

            <AddIcon
              sx={{ fontSize: "45px", color: "#f5e6e6", cursor: "pointer" }}
              onClick={() => navigate("/addRide")}
            />
            <SearchIcon
              sx={{ fontSize: "45px", color: "#f5e6e6", cursor: "pointer" }}
              onClick={() => {
                if (window.location.pathname !== "/home") {
                  navigate("/home");
                } else {
                  props.setSearch();
                }
              }}
            />
            <AccountCircleIcon
              sx={{ fontSize: "45px", color: "#f5e6e6", cursor: "pointer" }}
              onClick={handleClick}
            />
          </div>
        </div>
      </div>

      <ProfileDropdown
        anchorEl={anchorEl}
        handleClose={handleClose}
        currentUser={props.user}
      />
    </div>
  );
}

export default Navbar;
