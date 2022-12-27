const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  locationCreate,
  getAllApprovedLocations,
  tempLocation,
  uploadLocPicsController,
  uploadGSTDoc,
  getLocation,
  deleteFile,
  delLocation,
  approveLocation,
  getAllTempLoc,
  bookedDatesController,
  reviewRatingController,
  tempLocationGet
} = require("../controllers/location");

// const memoStorage = multer.memoryStorage();

// const upload = multer({ memoStorage });

//Create a Temporary Location
router.post("/templocation", tempLocation);

//get temp data
router.get("/templocation/:id", tempLocationGet);

//Incomplete Listings
router.get("/incomplist", getAllTempLoc)

//Creating a Location.
router.post("/createlocation", locationCreate);

//Get All approved Locations
router.get("/getlocations", getAllApprovedLocations);

//Get a location
router.get("/getlocation/:id", getLocation);

//Delete Location
router.delete("/dellocation/:id", delLocation);

//approve location
router.put("/approveloc/:id", approveLocation);

//upload locations pic
// router.post("/uploadlocpic", upload.single("pic"), uploadLocPicsController);

//upload GST documents
// router.post("/uploadgst", upload.single("pic"), uploadGSTDoc);

//delet file from storage
// router.delete("/deletefile", deleteFile);

//update booked dates of location
router.post("/bookeddates/", bookedDatesController);

//update booked dates of location
router.post("/reviewrating/", reviewRatingController);


module.exports = router;
