import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import Button from "@mui/material/Button";

import Navbar from "../navbar";

import axios from "axios";

import { useAuth } from "../../authContext";
import { Navigate } from "react-router-dom";
function RequestTabs() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;  // if the user(without login) directly hits a url path which is not accecssible publicly
  // then he/she will be redirected to the login page for verification maintaining the security of the website 

  const [requestsSent, setRequestsSent] = useState([]); 
  const [requestsReceived, setRequestsReceived] = useState([]);

  const [value, setValue] = React.useState("1");     // handles the tabs on the webpage

  const handleChange = (event, newValue) => {        // handles the change in tabs on the web page
    setValue(newValue);
  };

  /// functions for fetcing all the pending requests 
  useEffect(() => {
    if (!user) return;

    async function getRequestsMadeByUser(email) {
      try {
        const response = await axios.get(
          `http://localhost:3000/getRequestsMadeByUser/${email}`
        );
        if (response.data !== "Error") {
          setRequestsSent(response.data);
        } else {
          console.log("Requests sent couldn't be fetched.");
          alert("Couldn't fetch sent requests.");
        }
      } catch (error) {
        console.log("Requests sent couldn't be fetched:", error.message);
        alert("Couldn't fetch sent requests.");
      }
    }

    async function getRequestsMadeToUser(email) {
      try {
        const response = await axios.get(
          `http://localhost:3000/getRequestsMadeToUser/${email}`
        );
        if (response.data !== "Error") {
          setRequestsReceived(response.data);
        } else {
          console.log("Requests received couldn't be fetched.");
          alert("Couldn't fetch received requests.");
        }
      } catch (error) {
        console.log("Requests received couldn't be fetched:", error.message);
        alert("Couldn't fetch received requests.");
      }
    }

    getRequestsMadeByUser(user.email);
    getRequestsMadeToUser(user.email);
  }, [user]); // Depend on user, run only when user is available

  async function handleRequest(id, req_email, creator_email, signal) {
    const data = {
      id: id,
      req_email: req_email,
      creator_email: creator_email,
      signal: signal,
      msg: messages[id] !== undefined ? messages[id] : "",
    };
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/handleRequest",
        data
      );
      if (response.data == "Request handled successfully.") {
        alert("Your response has been recorded.");
        setMessages({ ...messages, [id]: "" });
      } else if (response.data == "Error") {
        alert("Failed to record your response.");
        setMessages({ ...messages, [id]: "" });
      }
    } catch (error) {
      console.log("Error in handling request :", error.message);
      alert("Failed to record your response.");
      setMessages({ ...messages, [id]: "" });
    }
  }

  const [messages, setMessages] = useState({});

  return (
    <>
      <Navbar />
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} centered>
              <Tab label="Requests received" value="1" sx={{ width: "50vw" }} />
              <Tab label="Requests sent" value="2" sx={{ width: "50vw" }} />
            </TabList>
          </Box>

          <TabPanel value="1">
            {requestsReceived.length != 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  padding: "16px",
                }}
              >
                {requestsReceived.map((request) => (
                  <Card
                    key={request.id}
                    style={{
                      padding: "15px",
                      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <CardContent>
                      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {request.req_name} 📞 {request.req_phone}
                      </h2>

                      <p style={{ fontStyle: "italic" }}>
                        <strong>Message: </strong>
                        {request.req_msg}
                      </p>
                      <hr style={{ margin: "8px 0" }} />
                      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Ride from {request.source} to {request.destination}
                      </h2>
                      <p>
                        {" "}
                        {request.time + " , " + request.date.substring(0, 10)}
                      </p>

                      <p style={{ fontWeight: "bold" }}>
                        Status:{" "}
                        <span style={{ color: "blue" }}>
                          {" "}
                          {request.ride_status}{" "}
                        </span>{" "}
                      </p>

                      <TextField
                        variant="standard"
                        sx={{ width: "100%" }}
                        type="text"
                        placeholder="Enter a message in response(optional)"
                        value={messages[request.id] || ""}
                        onChange={(e) =>
                          setMessages({
                            ...messages,
                            [request.id]: e.target.value,
                          })
                        }
                      />

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "30px",
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleRequest(
                              request.id,
                              request.req_email,
                              user.email,
                              "Accepted"
                            )
                          }
                          variant="contained"
                          color="primary"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            handleRequest(
                              request.id,
                              request.req_email,
                              user.email,
                              "Rejected"
                            )
                          }
                          variant="contained"
                          color="error"
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src="/no_req_found.png"
                  alt="No requests image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100vh",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value="2">
            {requestsSent.length != 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  padding: "16px",
                }}
              >
                {requestsSent.map((request) => (
                  <Card
                    key={request.id}
                    style={{
                      padding: "16px",
                      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <CardContent>
                      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Ride from {request.source} to {request.destination}
                      </h2>
                      <p>
                        {" "}
                        {request.time + " , " + request.date.substring(0, 10)}
                      </p>
                      <hr style={{ margin: "8px 0" }} />
                      <p>
                        <strong>Published by:</strong>
                      </p>
                      <p>
                        {" "}
                        {request.creator_name} 📞 {request.creator_phone}
                      </p>
                      <p style={{ fontWeight: "bold" }}>
                        Request status:{" "}
                        <span style={{ color: "green" }}>
                          {" "}
                          {request.req_status}{" "}
                        </span>{" "}
                      </p>{" "}
                      <p style={{ fontWeight: "bold" }}>
                        Ride status:{" "}
                        <span style={{ color: "blue" }}>
                          {" "}
                          {request.ride_status}{" "}
                        </span>{" "}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src="/no_req_found.png"
                  alt="No requests image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100vh",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}

export default RequestTabs;
