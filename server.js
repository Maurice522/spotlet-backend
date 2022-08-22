const express = require("express");
const app = express();
const cors = require("cors");
const fireAdmin = require("firebase-admin");
const serviceAccount = require("./serviceKey.json");

fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount),
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
