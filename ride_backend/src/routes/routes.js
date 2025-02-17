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

router.post("/getPresentRides", getAllPendingRides);
router.post("/getFilteredRides", getAllFilteredRides);
router.get("/getCompletedRides/:email", getAllCompletedRides);
router.get("/getPendingRides/:email", getUserSpecificPendingRides);
router.post("/sendRequest", sendRequest);
router.post("/handleRequest", handleRequest);
router.post("/addNewRide", addNewRide);
router.get("/getRequestsMadeToUser/:email", getRequestsMadeToUser);
router.get("/getRequestsMadeByUser/:email", getRequestsMadeByUser);
router.post("/availableLocations", getAvailableLocation);
router.get("/rideCreatorCompletedRide/:id", rideCreatorCompletedRide);
router.post("/rideSharerRideResponse", takeRideSharerRideResponse);

export default router;
