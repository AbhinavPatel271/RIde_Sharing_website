import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Autocomplete } from "@mui/material";

const default_locations = [
  "New York",
  "Los Angeles",
  "San Francisco",
  "Chicago",
  "Miami",
  "Boston",
  "Seattle",
];
import { useAuth } from "../authContext";
function RideSearchBox(props) {
  const [source, setSource] = useState("");
  const [sourceDropdown, setSourceDropdown] = useState(default_locations);
  const [destination, setDestination] = useState("");
  const [destinationDropdown, setDestinationDropdown] =
    useState(default_locations);
  const { user } = useAuth();
  useEffect(() => {
    async function getAvailableLocation() {
      console.log("Fetching available locations...");
      try {
        const response = await axios.post(
          "http://localhost:3000/availableLocations",
          { email: user.email }
        );
        console.log(`Available locations: ${response.data}`);

        let sourceLocations = new Set();
        let destinationLocations = new Set();

        response.data.forEach((item) => {
          sourceLocations.add(item.source);
          destinationLocations.add(item.destination);
        });

        setSourceDropdown([...sourceLocations]);
        setDestinationDropdown([...destinationLocations]);
      } catch (error) {
        console.log(
          `Error in fetching sources and destination: ${error.message}`
        );
      }
    }

    getAvailableLocation();
  }, []);

  async function handleSearch() {
    if (source == null) setSource("");
    if (destination == null) setDestination("");
    // checking that atleast one entry should be filled
    if (
      (source.trim().length == 0 || source == null) &&
      (destination.trim().length == 0 || destination == null)
    ) {
      alert("Please enter atleast one of the entries.");
    } else {
      try {
        const searchData = {
          src: source,
          dest: destination,
          email: user.email,
        };
        const response = await axios.post(
          "http://localhost:3000/getFilteredRides",
          searchData
        );
        if (response.data !== "Error") {
          props.setRides(response.data);
          console.log("yaha kaam kr");
        } else {
          console.log("Error in searcing rides");
          alert("Couldn't search mathced rides.");
        }
      } catch (error) {
        console.log("Error in searcing rides : ", error.message);
        alert("Couldn't search mathced rides.");
      }
    }
  }

  return (
    <div style={{ opacity: "1", marginTop: "20px" }}>
      <div
        style={{
          maxWidth: 400,
          margin: "auto",
          marginTop: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Autocomplete
            sx={{ px: 2 }}
            freeSolo
            options={sourceDropdown}
            value={source}
            onChange={(event, newValue) => setSource(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Source"
                fullWidth
                sx={{ my: 1 }}
                onChange={(e) => setSource(e.target.value)}
              />
            )}
          />

          <Autocomplete
            sx={{ px: 2 }}
            freeSolo
            options={destinationDropdown}
            value={destination}
            onChange={(event, newValue) => setDestination(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Destination"
                fullWidth
                sx={{ my: 1 }}
                onChange={(e) => setDestination(e.target.value)}
              />
            )}
          />

          <div
            style={{
              backgroundColor: "#A1E1E9",
              width: "100%",
              height: "25px",
              fontSize: "20px",
              color: "white",
              textAlign: "center",
              cursor: "pointer",
              marginTop: "8px",
              padding: "10px 0",
              borderRadius: "0 0 10px 10px",
            }}
            onClick={handleSearch}
          >
            SEARCH RIDE
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideSearchBox;
