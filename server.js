const express = require("express");
const app = express();
const cors = require("cors");
const fireAdmin = require("firebase-admin");
const {
  TYPE,
  FIREBASE_PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDER_X509_CERT_URL,
  CLIENT_X509_CERT_URL,
} = require("./config/key");

fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert({
    type: TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY,
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
    auth_uri: AUTH_URI,
    token_uri: TOKEN_URI,
    auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: CLIENT_X509_CERT_URL,
  }),
});
app.use(express.json());
app.use(cors());
app.use(require("./routes/userRoute"));
app.use(require("./routes/locationRoute"));
app.use(require("./routes/requestsRoute"));
let db = fireAdmin.firestore();

const PORT = process.env.PORT || "8000";

app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
