require("dotenv").config();
const functions = require("firebase-functions");

let config = require("./env.json");

if(Object.keys(functions.config()).length){
  config=functions.config();
}

const accountSid = config.service.twilio_account_sid;
const authToken = config.service.twilio_auth_token;

const sendSms = (phone, message) => {
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: config.service.twilio_phone_number,
      to: phone,
    })
    .then((message) => console.log(message.sid));
};

module.exports = sendSms;