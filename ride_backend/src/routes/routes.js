import express from "express";
import {
  getAllPendingRides,
  getAllFilteredRides,
  getAllCompletedRides,
  getUserSpecificPendingRides,
  sendRequest,
  handleRequest,
  addNewRide,
  getRequestsMadeToUser,
  getRequestsMadeByUser,
  getAvailableLocation,
  rideCreatorCompletedRide,
  takeRideSharerRideResponse,
} from "../controllers/controller.js";

const router = express.Router();

router.post("/getPresentRides", getAllPendingRides);        // for fetching all the available rides and showing to all iiti students 
router.post("/getFilteredRides", getAllFilteredRides);         //  for fetching all the available rides(filtered through search query) and showing to all iiti students 
router.get("/getCompletedRides/:email", getAllCompletedRides);   // for fetching the ride history and showing it to users 
router.get("/getPendingRides/:email", getUserSpecificPendingRides);    //  for fetching the pendings rides of a user 
router.post("/sendRequest", sendRequest);      // for sending a ride request from one user to another 
router.post("/handleRequest", handleRequest);      // for handling the request(accepted or rejected) as response from the request receiver's side
router.post("/addNewRide", addNewRide);       //  for creating a new ride 
router.get("/getRequestsMadeToUser/:email", getRequestsMadeToUser);       // for fetching all the requests received to a specific user
router.get("/getRequestsMadeByUser/:email", getRequestsMadeByUser);         // for fetching all the requests sent by a specific user
router.post("/availableLocations", getAvailableLocation);         //  for fetching all the avaible location for pending rides to show in the search dropdown
router.get("/rideCreatorCompletedRide/:id", rideCreatorCompletedRide);      // for marking a ride as completed
router.post("/rideSharerRideResponse", takeRideSharerRideResponse);       // for taking a ride sharer's response and the ratings as given by him

export default router;
