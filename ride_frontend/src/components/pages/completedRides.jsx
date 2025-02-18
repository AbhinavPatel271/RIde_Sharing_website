import React, { useState, useEffect } from "react";
import Navbar from "../navbar";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Rating,
} from "@mui/material";

import { useAuth } from "../../authContext";
import { Navigate, useNavigate } from "react-router-dom";
function CompletedRides() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/" state={{ route: "/completedRides" }} />;  // if the user(without login) directly hits a url path which is not accecssible publicly
  // then he/she will be redirected to the login page for verification maintaining the security of the website 

  const [value, setValue] = React.useState("1");                              //// this controls the tabs of the webpage
  const [selfMadeCompletedRides, setSelfMadeCompletedRides] = useState([]);       
  const [othersMadeCompletedRides, setOthersMadeCompletedRides] = useState([]);

  const handleChange = (event, newValue) => {      // this handles the change of tabs on the webpage
    setValue(newValue);    
  };

  useEffect(() => {
    // function for fetching ride history of the user
    async function getCompletedRides() {
      try {
        const response = await axios.get(
          `http://localhost:3000/getCompletedRides/${user.email}`
        );
        if (response.data !== "Error") {
          setSelfMadeCompletedRides(response.data.selfCreatedRides);
          setOthersMadeCompletedRides(response.data.othersCreatedRides);
        } else {
          console.log("Error in fetching Completed rides");
          alert("Error in fetching Completed rides. Please try again later.");
        }
      } catch (error) {
        console.log("Error in fetching Completed rides :", error.message);
        alert("Error in fetching Completed rides. Please try again later.");
      }
    }

    getCompletedRides();
  }, []);

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
            {selfMadeCompletedRides.length != 0 ? (
              <div
                style={{
                  width: "90%",
                  margin: "auto",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Completed Rides
                </Typography>
                <TableContainer component={Paper} elevation={3}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>
                          <b>#</b>
                        </TableCell>
                        <TableCell>
                          <b>Average Rating as given by ride partners</b>
                        </TableCell>
                        <TableCell>
                          <b>Source</b>
                        </TableCell>
                        <TableCell>
                          <b>Destination</b>
                        </TableCell>
                        <TableCell>
                          <b>Date</b>
                        </TableCell>
                        <TableCell>
                          <b>Time</b>
                        </TableCell>
                        <TableCell>
                          <b>Total Cost</b>
                        </TableCell>
                        <TableCell>
                          <b>Ride Status</b>
                        </TableCell>
                        <TableCell>
                          <b>Ride Partners</b>
                        </TableCell>
                        <TableCell>
                          <b>Phone Numbers</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selfMadeCompletedRides.map((ride, index) => (
                        <TableRow key={ride.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Rating
                              name="star-rating"
                              value={Math.round(ride.avg_rating)}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>{ride.source}</TableCell>
                          <TableCell>{ride.destination}</TableCell>
                          <TableCell>{ride.date.substring(0, 10)}</TableCell>
                          <TableCell>{ride.time}</TableCell>
                          <TableCell>{ride.total_cost}</TableCell>
                          <TableCell>{ride.ride_status}</TableCell>
                          <TableCell>{ride.req_names}</TableCell>
                          <TableCell>{ride.req_phones}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src="/no_completed_rides.png"
                  alt="No pending rides image"
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value="2">
            {othersMadeCompletedRides.length != 0 ? (
              <div
                style={{
                  width: "90%",
                  margin: "auto",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Rides You Joined
                </Typography>
                <TableContainer component={Paper} elevation={3}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>
                          <b>#</b>
                        </TableCell>
                        <TableCell>
                          <b>Average Rating as given by ride partners</b>
                        </TableCell>
                        <TableCell>
                          <b>Source</b>
                        </TableCell>
                        <TableCell>
                          <b>Destination</b>
                        </TableCell>
                        <TableCell>
                          <b>Date</b>
                        </TableCell>
                        <TableCell>
                          <b>Time</b>
                        </TableCell>
                        <TableCell>
                          <b>Total Cost</b>
                        </TableCell>
                        <TableCell>
                          <b>Ride Status</b>
                        </TableCell>
                        <TableCell>
                          <b>Ride Creator (Name & Phone)</b>
                        </TableCell>
                        <TableCell>
                          <b>Ride Partners</b>
                        </TableCell>
                        <TableCell>
                          <b>Phone Numbers</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {othersMadeCompletedRides.map((ride, index) => (
                        <TableRow key={ride.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Rating
                              name="star-rating"
                              value={Math.round(ride.avg_rating)}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>{ride.source}</TableCell>
                          <TableCell>{ride.destination}</TableCell>
                          <TableCell>{ride.date.substring(0, 10)}</TableCell>
                          <TableCell>{ride.time}</TableCell>
                          <TableCell>{ride.total_cost}</TableCell>
                          <TableCell>{ride.ride_status}</TableCell>
                          <TableCell>{`${ride.creator_name} (${ride.creator_phone})`}</TableCell>
                          <TableCell>{ride.req_names}</TableCell>
                          <TableCell>{ride.req_phones}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src="/no_completed_rides.png"
                  alt="No completed rides image"
                />
              </div>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default CompletedRides;
