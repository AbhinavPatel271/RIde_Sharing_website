import {
  getAllPresentPendingRides,
  getAllFilteredPendingRides,
  getAllUserCompletedRides,
  getAllUserSpecificPendingRides,
  handleUserSentRequest,
  handleUserReceivedRequest,
  addNewlyCreatedRide,
  getReceivedRequests,
  getSentRequests,
  getAvailablePendingLocation,
  markRideMakerRideAsCompleted,
  markRideSharerRideResponse,
} from "../models/model.js";

export async function getAllPendingRides(req, res) {
  try {
    const result = await getAllPresentPendingRides(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error in fetching pending rides :${error.message}`);
    res.json("Error");
  }
}

export async function getAllFilteredRides(req, res) {
  try {
    const result = await getAllFilteredPendingRides(req.body);
    res.json(result);
  } catch (error) {
    console.error(`Error in fetching filtered rides :${error.message}`);
    res.json("Error");
  }
}

export async function getAllCompletedRides(req, res) {
  try {
    const result = await getAllUserCompletedRides(req.params.email);
    res.json(result);
  } catch (error) {
    console.log(`Error in fetching completed rides:${error.message}`);
    res.json("Error");
  }
}

export async function getUserSpecificPendingRides(req, res) {
  try {
    const result = await getAllUserSpecificPendingRides(req.params.email);
    res.json(result);
  } catch (error) {
    console.log(`Error in fetching user specific pending rides:${error.stack}`);
    res.json("Error");
  }
}

export async function sendRequest(req, res) {
  try {
    const result = await handleUserSentRequest(req.body);
    res.json(result);
  } catch (error) {
    console.log("Error in making request :", error.stack);
    res.json("Error");
  }
}

export async function handleRequest(req, res) {
  try {
    await handleUserReceivedRequest(req.body);
    res.json("Request handled successfully.");
  } catch (error) {
    console.log("Error in handling request :", error.stack);
    res.json("Error");
  }
}

export async function addNewRide(req, res) {
  try {
    await addNewlyCreatedRide(req.body);
    res.json("Ride created successfully.");
  } catch (error) {
    console.log("Error in creating ride :", error.stack);
    res.json("Error");
  }
}

export async function getRequestsMadeToUser(req, res) {
  try {
    const result = await getReceivedRequests(req.params.email);
    res.json(result);
  } catch (error) {
    console.log(`Error in checking requests: ${error.stack}`);
    res.json("Error");
  }
}

export async function getRequestsMadeByUser(req, res) {
  try {
    const result = await getSentRequests(req.params.email);
    res.json(result);
  } catch (error) {
    console.log(`Error in checking requests: ${error.stack}`);
    res.json("Error");
  }
}

export async function getAvailableLocation(req, res) {
  try {
    const result = await getAvailablePendingLocation(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error in searching available locations : ${error.message}`);
    res.json("Error");
  }
}

export async function rideCreatorCompletedRide(req, res) {
  try {
    await markRideMakerRideAsCompleted(req.params.id);
    res.json("Success");
  } catch (error) {
    console.log(`Error in marking : ${error.message}`);
    res.json("Error");
  }
}

export async function takeRideSharerRideResponse(req, res) {
  try {
    await markRideSharerRideResponse(req.body);
    res.json("Success");
  } catch (error) {
    console.log("Error in marking :", error.message);
    res.json("Error");
  }
}
