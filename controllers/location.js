"use strict";

const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = require("../firebase");
//Random generated Id
const generateId = () => {
  let code = "";
  const characters = "0123456789";
  for (let i = 0; i < 5; i++)
    code +=
      characters[Math.floor(Math.random() * characters.length)];
  return code;
}

const tempLocation = async(req, res) => {
  try {
    //create a unique location Id
    const {location_id, data, name} = req.body;
    if(!location_id){
      const preName = name.replace(/\s/g,'').toLowerCase();
      let locationId = preName.substr(0,4) + generateId();
      let loc = await db.collection("location").doc(locationId).get();
      while(loc.exists){
        locationId = "";
        locationId = preName.substr(4) + generateId();
        loc = await db.collection("location").doc(locationId).get();
      }
      await db.collection("templocation").doc(locationId).set(data);
      return res.send(locationId);
    }
    // const snapshot = await db.collection("templocation").doc(location_id).get();
    // const templocation = snapshot.data();
    await db.collection("templocation").doc(location_id).update(data);
   return res.send("updated");
  } catch (error) {
    return res.status(400).send(error);
  }
}


const locationCreate = async (req, res) => {
  try {
    const { property_desc, pricing } = req.body.data;
      const {location_id} = req.body;
    const { user_id } = property_desc;

    const { film_webseries_ad, tv_series_other, corporate, individual} = pricing;
    
    const data = {
      timestamp: new Date(),
      ...req.body.data,
      pricing : {
        film_webseries_ad : {
            type : "Film",
            isPresent : film_webseries_ad.isPresent,
            hourly_rate : film_webseries_ad.hourly_rate
        },
        tv_series_other : {
          type : "TV",
          isPresent : tv_series_other.isPresent,
          hourly_rate : tv_series_other.hourly_rate
        },
        corporate : {
          type : "Corporate",
          isPresent : corporate.isPresent,
          hourly_rate : corporate.hourly_rate
        },
        individual : {
          type : "Individual",
          isPresent : individual.isPresent,
          hourly_rate : individual.hourly_rate
        },
      },
      verified : "Under Review"
    };
    
    if (!user_id) return res.status(422).send("Invalid user");

    await db.collection("location").doc(location_id).set(data);
    await db.collection("templocation").doc(location_id).delete()
    const snapshot = await db.collection("users").doc(user_id).get();
    const user = snapshot.data();
    //console.log(user);
    await db
      .collection("users")
      .doc(user_id)
      .update({ ...user, listedLocations: [...user.listedLocations, {...data, location_id}] });
    return res.send("Location Created");
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getAllLocations = async(req, res) => {
  try {
    const snapshots = await db.collection("location").where("verified", "==", "Approved").orderBy("timestamp", "desc").get();
    const locations = snapshots.docs.map(doc => {
      return { location_id : doc.id, ...doc.data()};
    })
    return res.json({locations});
  } catch (error) {
    return res.status(400).send(error);
  }
}

const getLocation = async(req, res) => {
  try {
    const snapshot = await db.collection("location").doc(req.params.locId).get();
    if(!snapshot.exists) return res.send("No location found...");
    const location = snapshot.data();
    return res.status(200).send(location);
  } catch (error) {
    return res.status(400).send(error);
  }
}

const uploadLocPicsController = async (req, res) => {
  try {
    const file = req.file;
    const imageRef = ref(storage, `locations/${file.originalname}`);
    const metatype = { contentType: file.mimetype, name: file.originalname };
    const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
    const url = await getDownloadURL(imageRef);
    return res.status(200).json({ message: "uploaded...", url: url });
  } catch (error) {
    return res.status(422).send(error);
  }
};

const uploadGSTDoc = async (req, res) => {
  try {
    const file = req.file;
    const imageRef = ref(storage, `gst/${file.originalname}`);
    const metatype = { contentType: file.mimetype, name: file.originalname };
    const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
    const url = await getDownloadURL(imageRef);
    return res.status(200).json({ message: "uploaded...", url: url });
  } catch (error) {
    return res.status(422).send(error);
  }
};


module.exports = {
  locationCreate,
  getLocation,
  getAllLocations,
  tempLocation,
  uploadLocPicsController,
  uploadGSTDoc
};
