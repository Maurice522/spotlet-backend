const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  locationCreate,
  getAllLocations,
  tempLocation,
  uploadLocPicsController,
  uploadGSTDoc,
  getLocation,
  deleteFile,
  delLocation,
  approveLocation,
  incompList,
  updateLocationInfo,
  tempLocationGet
} = require("../controllers/location");
const memoStorage = multer.memoryStorage();

const upload = multer({ memoStorage });

//Create a Temporary Location
router.post("/templocation", tempLocation);

//Incomplete Listings
router.get("/incomplist", incompList)

//Creating a Location.
router.post("/createlocation", locationCreate);

//approve location
router.put("/approveloc/:id",approveLocation);

//Get All Locations
router.get("/getlocations", getAllLocations);


//Get a location
router.get("/getlocation/:locId", getLocation);


//Delete Location
router.delete("/dellocation/:id", delLocation);


//upload locations pic
router.post("/uploadlocpic", upload.single("pic"), uploadLocPicsController);

//upload GST documents 
router.post("/uploadgst", upload.single("pic"), uploadGSTDoc);

//delet file from storage
router.delete("/deletefile", deleteFile);

//update created location data
router.post("/updatelocation/", updateLocationInfo);

//get temp data
router.get("/templocation/:location_id", tempLocationGet);

module.exports = router;
