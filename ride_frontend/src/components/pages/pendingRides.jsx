import React, { useState, useEffect } from "react";
import Navbar from "../navbar";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Card, CardContent, Rating } from "@mui/material";
import Button from "@mui/material/Button";

import axios from "axios";

import { useAuth } from "../../authContext";
import { Navigate } from "react-router-dom";
function PendingRides() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />; // Redirect if not logged in

  const [value, setValue] = useState("1");
  const [selfMadePendingRides, setSelfMadePendingRides] = useState([]);
  const [othersMadePendingRides, setOthersMadePendingRides] = useState([]);
  const [ratingValues, setRatingValues] = useState({});

  const handleRatingChange = (rideId, newValue) => {
    setRatingValues((prevRatings) => ({
      ...prevRatings,
      [rideId]: newValue,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /// call krwao isko

  useEffect(() => {
    async function getPendingRides() {
      try {
        const response = await axios.get(
          `http://localhost:3000/getPendingRides/${user.email}`
        );
        if (response.data !== "Error") {
          setSelfMadePendingRides(response.data.selfCreatedRides);
          setOthersMadePendingRides(response.data.othersCreatedRides);
        } else {
          console.log("Error in fetching pending rides");
          alert("Error in fetching pending rides. Please try again later.");
        }
      } catch (error) {
        console.log("Error in fetching pending rides :", error.message);
        alert("Error in fetching pending rides. Please try again later.");
      }
    }

    getPendingRides();
  }, []);

  async function handleRideCompletionOfCreator(id) {
    try {
      const response = await axios.get(
        `http://localhost:3000/rideCreatorCompletedRide/${id}`
      );
      if (response.data == "Success") alert("Ride marked as completed.");
      else
        alert(
          "There was an error while marking the ride as complete. Please try again later."
        );
    } catch (error) {
      console.log("Error in marking :", error.message);
      alert(
        "There was an error while marking the ride as complete. Please try again later."
      );
    }
  }

  async function handleRideCompletionOfRideSharer(id, sharer_email, signal) {
    const data = {
      id: id,
      email: sharer_email,
      signal: signal,
      rating: signal === "Completed" ? ratingValues[id] : 0,
    };
    try {
      const response = await axios.post(
        `http://localhost:3000/rideSharerRideResponse`,
        data
      );
      if (response.data == "Success") alert("Response recorded.");
      else
        alert(
          "There was an error while storing the response. Please try again later."
        );
    } catch (error) {
      console.log("Error in marking :", error.message);
      alert(
        "There was an error while storing the response. Please try again later."
      );
    }
  }

  return (
    <div>
      <Navbar />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} centered>
              <Tab label="Rides Made by you" value="1" sx={{ width: "50vw" }} />
              <Tab
                label="Rides made by others"
                value="2"
                sx={{ width: "50vw" }}
              />
            </TabList>
          </Box>

          <TabPanel value="1">
            {selfMadePendingRides.length != 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  padding: "16px",
                }}
              >
                {selfMadePendingRides.map((ride) => {
                  const names = ride.req_names.split(", ");
                  const phones = ride.req_phones.split(", ");

                  return (
                    <Card
                      key={ride.id}
                      style={{
                        padding: "16px",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                      }}
                    >
                      <CardContent>
                        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                          Ride from {ride.source} to {ride.destination}
                        </h2>
                        <p> {ride.time + " , " + ride.date.substring(0, 10)}</p>
                        <p>
                          <strong>Total Cost:</strong> {ride.total_cost}
                        </p>
                        <p style={{ fontWeight: "bold" }}>
                          Ride status:{" "}
                          <span style={{ color: "blue" }}>
                            {" "}
                            {ride.ride_status}{" "}
                          </span>{" "}
                        </p>
                        <hr style={{ margin: "8px 0" }} />
                        <p>
                          <strong>Ride Partners:</strong>
                        </p>
                        <div>
                          {names.map((name, i) => (
                            <p key={i}>
                              {name} 📞 {phones[i]}
                            </p>
                          ))}
                        </div>
                        <div style={{ marginTop: "12px" }}>
                          <Button
                            onClick={() =>
                              handleRideCompletionOfCreator(ride.id)
                            }
                            variant="contained"
                            color="primary"
                          >
                            Mark as Completed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img src="/no_pending_rides.png" alt="No pending rides image" />
              </div>
            )}
          </TabPanel>

          <TabPanel value="2">
            {othersMadePendingRides.length != 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  padding: "16px",
                }}
              >
                {othersMadePendingRides.map((ride, index) => (
                  <Card
                    key={index}
                    style={{
                      padding: "16px",
                      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <CardContent>
                      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Ride from {ride.source} to {ride.destination}
                      </h2>
                      <p> {ride.time + " , " + ride.date.substring(0, 10)}</p>
                      <p>
                        <strong>Total Cost:</strong> {ride.total_cost}
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Ride status:{" "}
                        <span style={{ color: "blue" }}>
                          {" "}
                          {ride.ride_status}{" "}
                        </span>{" "}
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Request status:{" "}
                        <span
                          style={{
                            color:
                              ride.req_status === "Accepted" ? "green" : "red",
                          }}
                        >
                          {" "}
                          {ride.req_status}{" "}
                        </span>{" "}
                      </p>
                      <hr style={{ margin: "8px 0" }} />
                      <p>
                        <strong>Ride published by:</strong>{" "}
                      </p>
                      <p>
                        {" "}
                        {ride.creator_name} 📞 {ride.creator_phone}
                      </p>
                      <hr style={{ margin: "8px 0" }} />
                      <p>
                        <strong>Ride Partners:</strong>
                      </p>
                      {ride.req_names.split(",").map((name, i) => (
                        <p key={i}>
                          {name} 📞 {ride.req_phones.split(",")[i]}
                        </p>
                      ))}
                      <div style={{ marginTop: "12px" }}>
                        {ride.req_status === "Accepted" ? (
                          <div>
                            <p>Please give ratings for your ride:</p>

                            <Rating
                              name={`rating-${ride.id}`}
                              value={ratingValues[ride.id] || 0}
                              onChange={(event, newValue) =>
                                handleRatingChange(ride.id, newValue)
                              }
                            />
                            <br />
                            <Button
                              onClick={() =>
                                handleRideCompletionOfRideSharer(
                                  ride.id,
                                  user.email,
                                  "Completed"
                                )
                              }
                              variant="contained"
                              color="primary"
                            >
                              Mark as Completed
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() =>
                              handleRideCompletionOfRideSharer(
                                ride.id,
                                user.email,
                                "Removed"
                              )
                            }
                            variant="contained"
                            color="error"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img src="/no_pending_rides.png" alt="No pending rides image" />
              </div>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default PendingRides;
