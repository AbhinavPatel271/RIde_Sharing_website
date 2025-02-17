import React, { useState } from "react";
import { TextField, Button, Card, CardContent } from "@mui/material";
import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Navbar from "../navbar";
import dayjs from "dayjs";
import axios from "axios";

import { useAuth } from "../../authContext";
import { Navigate } from "react-router-dom";

function AddRide() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  const [rideDetails, setRideDetails] = useState({
    email: user.email,
    source: "",
    destination: "",
    date: null,
    time: null,
    rideType: "",
    seatsAvailable: "",
    totalCost: "",
    createdBy: "",
    phone: "",
  });

  const locations = ["IIT Indore Gate No.1", "Indore Junction", "Indore Airport"];
  const rideTypes = ["Cab", "Auto", "Bike"];

  const handleChange = (field, value) => {
    setRideDetails({ ...rideDetails, [field]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formattedDate = dayjs(rideDetails.date).format("YYYY-MM-DD");
    const formattedTime = dayjs(rideDetails.time).format("HH:mm:ss");

    const data = {
      ...rideDetails,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      console.log(data);

      const response = await axios.post(
        `http://localhost:3000/addNewRide`,
        data
      );
      if (response.data === "Ride created successfully.") {
        alert("Ride created successfully.");
        setRideDetails({
          email: user.email,
          source: "",
          destination: "",
          date: null,
          time: null,
          rideType: "",
          seatsAvailable: "",
          totalCost: "",
          createdBy: "",
          phone: "",
        });
      } else {
        console.log(`Error in creating a ride.`);
        alert("Couldn't create a ride. Please try again later.");
      }
    } catch (error) {
      console.log(`Error in creating a ride : ${error.message}`);
      alert("Couldn't create a ride. Please try again later.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="add-ride-image">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Card
            sx={{
              maxWidth: 500,
              p: 3,
              boxShadow: 3,
              borderRadius: 3,
              margin: "20px auto 10px auto",
              backgroundColor: "rgba(232, 245, 233, 0.8)",
            }}
          >
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Autocomplete
                  freeSolo
                  options={locations}
                  value={rideDetails.source}
                  onChange={(event, newValue) =>
                    handleChange("source", newValue)
                  }
                  onInputChange={(event, newValue) =>
                    handleChange("source", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Source"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      required
                    />
                  )}
                />

                <Autocomplete
                  freeSolo
                  options={locations}
                  value={rideDetails.destination}
                  onChange={(event, newValue) =>
                    handleChange("destination", newValue)
                  }
                  onInputChange={(event, newValue) =>
                    handleChange("destination", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destination"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      required
                    />
                  )}
                />

                <DesktopDatePicker
                  label="Date"
                  inputFormat="YYYY-MM-DD"
                  value={rideDetails.date}
                  onChange={(newValue) => handleChange("date", newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="dense" required />
                  )}
                />

                <TimePicker
                  label="Time"
                  value={rideDetails.time}
                  onChange={(newValue) => handleChange("time", newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="dense" required />
                  )}
                />

                <Autocomplete
                  freeSolo
                  options={rideTypes}
                  value={rideDetails.rideType}
                  onChange={(event, newValue) =>
                    handleChange("rideType", newValue)
                  }
                  onInputChange={(event, newValue) =>
                    handleChange("rideType", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ride Type"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      required
                    />
                  )}
                />

                <TextField
                  label="Seats Available"
                  type="number"
                  value={rideDetails.seatsAvailable}
                  onChange={(e) =>
                    handleChange("seatsAvailable", e.target.value)
                  }
                  fullWidth
                  margin="dense"
                  required
                />

                <TextField
                  label="Total Cost (₹)"
                  type="number"
                  value={rideDetails.totalCost}
                  onChange={(e) => handleChange("totalCost", e.target.value)}
                  fullWidth
                  margin="dense"
                  required
                />

                <TextField
                  label="Your Name"
                  value={rideDetails.createdBy}
                  onChange={(e) => handleChange("createdBy", e.target.value)}
                  fullWidth
                  margin="dense"
                  required
                />

                <TextField
                  label="Phone Number"
                  type="tel"
                  value={rideDetails.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  fullWidth
                  margin="dense"
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "#A1E1E9" }}
                >
                  CREATE RIDE
                </Button>
              </form>
            </CardContent>
          </Card>
        </LocalizationProvider>
      </div>
    </>
  );
}

export default AddRide;
