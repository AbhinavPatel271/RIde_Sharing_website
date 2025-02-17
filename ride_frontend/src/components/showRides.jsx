import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import RequestDialog from "./requestDialogBox";

function ShowRides(props) {
  const [open, setOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [selectedRideMakerEmail, setSelectedRideMakerEmail] = useState(null);
  const [selectedRideMakerName, setSelectedRideMakerName] = useState(null);
  const [selectedRideMakerPhone, setSelectedRideMakerPhone] = useState(null);

  function handleRequest(id, email, name, phone) {
    setSelectedRideId(id);
    setSelectedRideMakerEmail(email);
    setSelectedRideMakerName(name);
    setSelectedRideMakerPhone(phone);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelectedRideId(null);
    setSelectedRideMakerEmail(null);
  }

  return (
    <div className="show-rides">
      {props.rides.map((ride) => {
        return (
          <div key={ride.id}>
            <Card className="ride-card">
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {ride.source} ➞ {ride.destination}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🕒 {ride.time + " , " + ride.date.substring(0, 10)}
                </Typography>
                <Typography variant="body2">
                  🚖 {ride.ride_type} | 🛊 {ride.seats_available} seats
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  ₹{ride.total_cost}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  👤 {ride.creator_name} | 📞 {ride.creator_phone}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 3 }}
                  onClick={() =>
                    handleRequest(
                      ride.id,
                      ride.creator_email,
                      ride.creator_name,
                      ride.creator_phone
                    )
                  }
                >
                  Request
                </Button>
              </Box>
            </Card>
          </div>
        );
      })}
      <RequestDialog
        open={open}
        handleClose={handleClose}
        rideId={selectedRideId}
        rideMakerMail={selectedRideMakerEmail}
        creator_name={selectedRideMakerName}
        creator_phone={selectedRideMakerPhone}
      />
    </div>
  );
}

export default ShowRides;
