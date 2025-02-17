import React, { useState, useEffect } from "react";
import Navbar from "../navbar.jsx";
import axios from "axios";

import RideSearchBox from "../rideSearchBox";
import ShowRides from "../showRides";
import RideSwapCard from "../rideSwapCard.jsx";
import { useAuth } from "../../authContext";
import { Navigate } from "react-router-dom";

function Home() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // Redirect if not logged in

  const [allRidesStatus, setAllRidesStatus] = useState(false);
  const [ridesFromBackend, setRides] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const [userSearched, handleUserSearched] = useState(false);
  const [searchedRidesStatus, setSearchedRidesStatus] = useState(false);
  const [searchedRides, setSearchRideResults] = useState(null);
  const [requestsSent, setRequestsSent] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function getRides() {
      try {
        const response = await axios.post(
          "http://localhost:3000/getPresentRides",
          { email: user.email }
        );
        if (response.data !== "Error") {
          if (response.data.length !== 0) {
            setAllRidesStatus(true);
            setRides(response.data);
          } else setAllRidesStatus(false);
        } else {
          setAllRidesStatus(false);
          alert("An error occurred while fetching all the available rides.");
        }
      } catch (error) {
        setAllRidesStatus(false);
        console.log("Error in getting rides:", error.message);
        alert("An error occurred while fetching all the available rides.");
      }
    }

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

    getRides();
    getRequestsMadeByUser(user.email);
    getRequestsMadeToUser(user.email);
  }, [user]); // Depend on user, run only when user is available

  function search() {
    setShowSearch((prev) => !prev);
  }

  function setSearchResults(availableRides) {
    handleUserSearched(true);
    setAllRidesStatus(false);

    if (availableRides.length != 0) {
      setSearchedRidesStatus(true);
      setSearchRideResults(availableRides);
    } else setSearchedRidesStatus(false);
  }

  return (
    <div className="home">
      <Navbar
        user={user}
        setSearch={search}
        numNotification={requestsSent.length + requestsReceived.length}
        requestsSent={requestsSent}
        requestsReceived={requestsReceived}
      />

      <div className="home-image"> </div>

      <div style={{ opacity: "0.92", marginTop: "-75vh" }}>
        {showSearch && <RideSearchBox setRides={setSearchResults} />}

        {allRidesStatus && !userSearched ? (
          <ShowRides rides={ridesFromBackend} />
        ) : (
          !userSearched && (
            <div style={{ marginTop: "300px", textAlign: "center" }}>
              <img src="/no_rides.png" alt="No rides available image." />
            </div>
          )
        )}

        {searchedRidesStatus && userSearched ? (
          <div>
            <ShowRides rides={searchedRides} />
          </div>
        ) : (
          userSearched && (
            <div style={{ marginTop: "300px", textAlign: "center" }}>
              <img
                src="/no_matching_rides_found.png"
                alt="No rides available image."
                style={{
                  maxWidth: "100%",
                  maxHeight: "100vh",
                  objectFit: "contain",
                  marginTop: "100px",
                }}
              />
            </div>
          )
        )}
      </div>

      <div className="popular-rides">
        <RideSwapCard
          initialSource={"IIT Indore Campus"}
          initialDestination={"Indore Junction"}
        />
        <RideSwapCard
          initialSource={"IIT Indore Campus"}
          initialDestination={"Indore Airport"}
        />
      </div>

      <div className="footer-image">
        <img
          src="/carpool_image.webp"
          alt="Carpooling image"
          style={{ width: "100vw" }}
        />
      </div>
    </div>
  );
}

export default Home;
