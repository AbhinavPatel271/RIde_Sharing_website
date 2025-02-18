import React, { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useAuth } from "../authContext";

function RequestDialog({
  open,
  handleClose,
  rideId,
  rideMakerMail,
  creator_name,
  creator_phone,
}) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");


  // function for handling the request the user sends to any of the available rides and then giving proper response to the user
  async function handleSend() {
    try {
      if (message === null) setMessage("");
      const reqData = {
        id: rideId,
        creator_name: creator_name,
        creator_phone: creator_phone,
        creator_email: rideMakerMail,
        req_name: name,
        req_number: phone,
        req_message: message,
        req_email: user.email,
      };
      if (
        name.trim().length == 0 ||
        name == null ||
        phone.trim().length == 0 ||
        phone == null
      )
        alert("Please enter both the entries.");
      else {
        console.log(reqData);

        const response = await axios.post(
          `http://localhost:3000/sendRequest`,
          reqData
        );
        if (response.data === "Request_Made") {
          alert("Reqeust sent.");
        } else if (response.data === "Accepted")
          alert("Your request is already accepted for this ride.");
        else if (response.data === "Pending")
          alert(
            "Your request is still pending for this ride. Cannot make request again."
          );
        else {
          console.log("couldn't make request ");
          alert(
            "An error occurred while sending the request. Please try again later."
          );
        }

        handleClose();
        setName("");
        setPhone("");
        setMessage("");
      }
    } catch (error) {
      console.log("Couldn't make request :", error.message);
      alert(
        "An error occurred while sending the request. Please try again later."
      );
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Request a Ride</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Name"
          variant="outlined"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Phone Number"
          variant="outlined"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Message (Optional)"
          variant="outlined"
          multiline
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>

        <Button onClick={handleSend} color="primary" variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RequestDialog;
