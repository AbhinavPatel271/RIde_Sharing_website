import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Popover,
  Typography,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import handleLogout from "./logout.jsx";
import { useAuth } from "../authContext.jsx";

const ProfileDropdown = ({ anchorEl, handleClose }) => {
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const id = open ? "profile-popover" : undefined;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user, setUser } = useAuth();

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          <Avatar
            alt="User"
            src={user.photoURL}
            sx={{ width: 60, height: 60, margin: "auto" }}
          />
          <Typography variant="h6" fontWeight="bold" align="center">
            {user.displayName}
          </Typography>
          <Typography variant="body1" align="center">
            {user.email}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Button fullWidth onClick={() => navigate("/pendingRides")}>
            Pending Rides
          </Button>
          <Button fullWidth onClick={() => navigate("/completedRides")}>
            Completed Rides
          </Button>

          <Divider sx={{ my: 1 }} />
          <Button
            fullWidth
            color="error"
            onClick={() => setLogoutDialogOpen(true)}
          >
            Logout
          </Button>
        </Box>
      </Popover>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              setLogoutDialogOpen(false);
              handleLogout(navigate, setUser);
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileDropdown;
