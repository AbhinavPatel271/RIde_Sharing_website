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

  if (!user) return <Navigate to="/" />;  // if the user(without login) directly hits a url path which is not accecssible publicly
  // then he/she will be redirected to the login page for verification maintaining the security of the website 

  const [allRidesStatus, setAllRidesStatus] = useState(false);     // checks if any ride is available or not
  const [ridesFromBackend, setRides] = useState([]);          // stores all the available rides at the moment 
  const [showSearch, setShowSearch] = useState(true);            // handles the ride search box on the home page
  const [userSearched, handleUserSearched] = useState(false);         // handles what users want to see - all rides or just specific rides(on basis of searching)
  const [searchedRidesStatus, setSearchedRidesStatus] = useState(false);      //    checks if any ride(as searched by user) is available or not
  const [searchedRides, setSearchRideResults] = useState(null);          // stores all the filtered rides(in any) as searched by the user
  const [requestsSent, setRequestsSent] = useState([]);        // stores all the pending requests which user sent to others
  const [requestsReceived, setRequestsReceived] = useState([]);         // stores all the pending requests which user received others

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
  }, [user]); // Depend on user, runs only when user is available

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
        setSearch={search}      // this is used to handle the toggling of the search bar on the home page
        numNotification={requestsSent.length + requestsReceived.length}      // this will give signal to navbar that how many requests are pending which in turn will notify the user
        requestsSent={requestsSent}
        requestsReceived={requestsReceived}
      />

      <div className="home-image"> </div>        {/* this is for the background image on the home page */}

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
