"use strict";

// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();
// const { ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
// const storage = require("../firebase");
const { s3 } = require('../awsS3');

const {
  EMAIL_FROM,
  SIB_API,
  BUCKET,
} = require("../config/key");
const Sib = require('sib-api-v3-sdk');
const Location = require("../models/Location");
const TempLocation = require("../models/TempLocation");
const User = require("../models/User");

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = SIB_API

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
  email: EMAIL_FROM,
  name: "Spotlet"
}

//Random generated Id
const generateId = () => {
  let code = "";
  const characters = "0123456789";
  for (let i = 0; i < 5; i++)
    code +=
      characters[Math.floor(Math.random() * characters.length)];
  return code;
}

const tempLocation = async (req, res) => {
  try {
    //create a unique location Id
    const { location_id, data } = req.body;
    const name = data.property_desc.property_name;

    if (!location_id) {
      const preName = name.replace(/\s/g, '').toLowerCase();
      let locationId = preName.substr(0, 4) + generateId();
      let loc = await Location.findOne({ location_id: locationId });
      while (loc) {
        locationId = "";
        locationId = preName.substr(4) + generateId();
        loc = await Location.findOne({ location_id: locationId });
      }

      const newTempLoc = new TempLocation({
        property_desc: data.property_desc,
        location_id: locationId
      });

      await newTempLoc.save();

      return res.status(200).send(locationId);
    }
    const temploc = await TempLocation.findOne({ location_id: location_id });
    await TempLocation.findByIdAndUpdate(temploc._id, { $set: data, }, { new: true });

    return res.status(200).send("updated");
  } catch (error) {
    return res.status(400).send(error);
  }
}

const tempLocationGet = async (req, res) => {
  try {
    const templocation = await TempLocation.findOne({ location_id: req.params.id });
    return res.status(200).send(templocation);
  } catch (error) {
    return res.status(400).send(error);
  }
}

const getAllTempLoc = async (req, res) => {
  try {
    const templocations = await TempLocation.find().sort({ "timestamp": -1 });;

    res.status(200).send(templocations);
  } catch (error) {
    return res.status(400).send(error);
  }
}

const locationCreate = async (req, res) => {
  try {
    const { location_id } = req.body;
    const { property_desc, pricing } = req.body.data;

    const { user_id } = property_desc;
    const { film_webseries_ad, tv_series_other, corporate, individual, cleaningFee } = pricing;

    if (!user_id)
      return res.status(401).send("Invalid User");

    const newLocation = new Location({
      ...req.body.data,
      location_id: location_id,
      pricing: {
        cleaningFee: cleaningFee,
        film_webseries_ad: {
          type: "Film",
          isPresent: film_webseries_ad.isPresent,
          hourly_rate: film_webseries_ad.hourly_rate,
          attendees: film_webseries_ad.attendees
        },
        tv_series_other: {
          type: "TV",
          isPresent: tv_series_other.isPresent,
          hourly_rate: tv_series_other.hourly_rate,
          attendees: tv_series_other.attendees
        },
        corporate: {
          type: "Corporate",
          isPresent: corporate.isPresent,
          hourly_rate: corporate.hourly_rate,
          attendees: corporate.attendees
        },
        individual: {
          type: "Individual",
          isPresent: individual.isPresent,
          hourly_rate: individual.hourly_rate,
          attendees: individual.attendees
        },
      },
      review_and_rating: [],
      verified: "Under Review"
    })

    const createdLocation = await newLocation.save();

    const temploc = await TempLocation.findOne({ location_id: location_id });
    await TempLocation.findByIdAndDelete(temploc._id);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    const notification = {
      content: `Your location ${location_id} request has been sent`,
      link: `#`,
      date: `${today}`,
      admin: false
    }

    const user = await User.findOne({ _id: user_id });

    await User.findByIdAndUpdate(user_id,
      {
        $set: {
          ...user._doc,
          listedLocations: [...user.listedLocations, createdLocation],
          notifications: [...user.notifications, notification],
          notificationFlag: true
        },
      },
      { new: true }
    );

    const receivers = [{ email: user.personalInfo.email },]
    const emailData = {
      sender,
      to: receivers,
      subject: "Congratulations on Submitting your Property on SpotLet.",
      htmlContent: `<p>Hi,<br>Welcome to SpotLet’s Host Family. Thank you for submitting your property on our portal.
      Your location ${location_id}, request has been sent to the ADMIN
      We’re excited to see you go live and enjoy all the countless queries and bookings that come
      your way.
      Our Host team is reviewing your listing to ensure that you have included all the details
      required for a successful and profitable listing on SpotLet. We will revert within the next 5
      days.
      If you have any further questions about hosting through SpotLet, we’ll be happy to answer
      them.
      As hosts, we value your association with SpotLet and look forward to a long-term business
      relationship. While waiting for your property to go live, you can also read our blogs or go
      through our knowledge base to see how to edit your listing or add more details to become a
      successful host on SpotLet.
      We can’t wait to share the SpotLight with you.
      Thank you!
      </p>`,
    };

    await tranEmailApi.sendTransacEmail(emailData);

    return res.status(200).send("Location Created");
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getAllApprovedLocations = async (req, res) => {
  try {
    const locations = await Location.find({ verified: "Approved" }).sort({ "timestamp": -1 });;
    return res.status(200).json(locations);
  } catch (error) {
    return res.status(400).send(error);
  }
}

const getLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ location_id: req.params.id });
    if (!location)
      return res.status(404).send("No location found...");
    return res.status(200).send(location);
  } catch (error) {
    return res.status(400).send(error);
  }
}

const delLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ location_id: req.params.id });
    await Location.findByIdAndDelete(location._id);

    const user_id = location._doc.property_desc.user_id;

    const user = await User.findOne({ _id: user_id });

    const listedloc = user._doc.listedLocations;
    const deletelistedloc = listedloc.map((loc) => {
      if (req.params.id !== loc.location_id) {
        return loc;
      }
    })

    await User.findByIdAndUpdate(user_id,
      {
        $set: {
          ...user._doc,
          listedLocations: deletelistedloc ? deletelistedloc : [],
        },
      },
      { new: true }
    );

    res.status(200).send("Location Deleted");
  } catch (error) {
    return res.status(400).send(error);
  }
}

const approveLocation = async (req, res) => {
  try {
    const { user_id } = req.body;

    const location = await Location.findOne({ location_id: req.params.id });
    if (!location)
      return res.status(404).send("No location found...");

    await Location.findByIdAndUpdate(location._id,
      {
        $set: {
          ...location._doc,
          verified: "Approved"
        },
      },
      { new: true }
    );


    const user = await User.findOne({ _id: user_id });

    const listedloc = user._doc.listedLocations;
    listedloc.map((loc) => {
      if (req.params.id === loc.location_id.toString()) {
        loc.verified = "Approved"
      }
    })

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    const notification = {
      content: `Your location ${req.params.id} has been approved`,
      link: `/property/${req.params.id}`,
      date: `${today}`,
      admin: false
    }
    // console.log(notification);

    await User.findByIdAndUpdate(user_id,
      {
        $set: {
          ...user._doc,
          listedLocations: listedloc,
          notifications: [...user.notifications, notification],
          notificationFlag: true
        },
      },
      { new: true }
    );

    const receivers = [{ email: user.personalInfo.email },]
    const emailData = {
      sender,
      to: receivers,
      subject: "Location Approved",
      htmlContent: `<p>Your location ${req.params.id}, request has been approved by the ADMIN</p>`,
    };

    await tranEmailApi.sendTransacEmail(emailData);

    return res.status(200).send("Location Approved");
  } catch (error) {
    return res.status(400).send(error);
  }
}

const updateLocationController = async (req, res) => {
  try {
    const { newLocData, location_id } = req.body;

    const location = await Location.findOne({ location_id: location_id });
    if (!location)
      return res.status(404).send("No location found...");

    await Location.findByIdAndUpdate(location._id,
      {
        $set: {
          ...location._doc,
          amenities: newLocData.amenities,
          bankDetails: newLocData.bankDetails,
          bookedDates: newLocData.bookedDates,
          contact_det: newLocData.contact_det,
          do_and_dont: newLocData.do_and_dont,
          features: newLocData.features,
          gst: newLocData.gst,
          imagesData: newLocData.imagesData,
          pricing: newLocData.pricing,
          property_address: newLocData.property_address,
          property_desc: newLocData.property_desc,
          rules: newLocData.rules,
          timings: newLocData.timings,
          review_and_rating: newLocData.review_and_rating,
          verified: newLocData.verified,
        },
      },
      { new: true }
    );

    const user = await User.findOne({ _id: location._doc.property_desc.user_id });

    const listedloc = user._doc.listedLocations;
    listedloc.map((loc) => {
      if (location_id === loc.location_id.toString()) {
        loc.amenities = newLocData.amenities;
        loc.bankDetails = newLocData.bankDetails;
        loc.bookedDates = newLocData.bookedDates;
        loc.contact_det = newLocData.contact_det;
        loc.do_and_dont = newLocData.do_and_dont;
        loc.features = newLocData.features;
        loc.gst = newLocData.gst;
        loc.imagesData = newLocData.imagesData;
        loc.pricing = newLocData.pricing;
        loc.property_address = newLocData.property_address;
        loc.property_desc = newLocData.property_desc;
        loc.rules = newLocData.rules;
        loc.timings = newLocData.timings;
        loc.review_and_rating = newLocData.review_and_rating;
        loc.verified = newLocData.verified;
      }
    })

    await User.findByIdAndUpdate(location._doc.property_desc.user_id,
      {
        $set: {
          ...user._doc,
          listedLocations: listedloc,
        },
      },
      { new: true }
    );

    return res.status(200).send("Location Updated");
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

const uploadLocPicsController = async (req, res) => {
  const file = req.file;

  try {
    const params = {
      Bucket: BUCKET,
      Key: `location/images/${file.originalname}`,
      Body: file.buffer
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      // console.log(data, err);
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(200).json({ message: "uploaded...", url: data.Location });
    });

  } catch (error) {
    return res.status(422).send(error);
  }
};

const uploadGSTDoc = async (req, res) => {
  const file = req.file;

  try {
    const params = {
      Bucket: BUCKET,
      Key: `location/gst/${file.originalname}`,
      Body: file.buffer,
      "ContentType": 'application/pdf',
      "ContentDisposition": 'inline',
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      // console.log(data, err);
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(200).json({ message: "uploaded...", url: data.Location });
    });

  } catch (error) {
    return res.status(422).send(error);
  }
};

const deleteFile = async (req, res) => {
  try {
    const { image, file, fileRef } = req.body;

    let params;
    if (image) {
      params = {
        Bucket: BUCKET,
        Key: image.split('/')[3] + "/" + image.split('/')[4] + "/" + image.split('/')[5],
      };
    }
    if (file) {
      params = {
        Bucket: BUCKET,
        Key: file.split('/')[3] + "/" + file.split('/')[4] + "/" + file.split('/')[5],
      };
    }

    // Delete files to the bucket
    s3.deleteObject(params, function (err, data) {
      // console.log(data, err);
      if (err) {
        throw err;
      }
      console.log(`File deleted successfully.`);
      return res.status(200).json({ message: "deleted..." });
    });

  } catch (error) {
    console.log(error);
    return res.status(422).send(error);
  }
}

//booked dates
const bookedDatesController = async (req, res) => {
  try {
    const { location_id, bookedDates } = req.body;

    const location = await Location.findOne({ location_id: location_id });

    await Location.findByIdAndUpdate(location._id,
      {
        $set: {
          ...location._doc,
          bookedDates: bookedDates
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "date booked" });
  } catch (error) {
    res.status(400).send(error);
  }
};

//reviw rating
const reviewRatingController = async (req, res) => {
  try {
    const { location_id, review_and_rating } = req.body;

    const location = await Location.findOne({ location_id: location_id });

    await Location.findByIdAndUpdate(location._id,
      {
        $set: {
          ...location._doc,
          review_and_rating: [...location.review_and_rating, review_and_rating]
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "review and rating sent" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


module.exports = {
  delLocation,
  locationCreate,
  getLocation,
  getAllApprovedLocations,
  tempLocation,
  uploadLocPicsController,
  uploadGSTDoc,
  deleteFile,
  approveLocation,
  getAllTempLoc,
  bookedDatesController,
  updateLocationController,
  reviewRatingController,
  tempLocationGet
};
