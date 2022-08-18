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
// app.post("/", async (req, res) => {
//   const email = "sayamc@gmail.com";
//   const snapshot = await db
//     .collection("users")
//     .where("email", "==", email)
//     .get();
//   if (!snapshot.empty) return res.json({ data: "exists" });
//   await db.collection("users").doc().set({
//     fullName: "Satyam",
//     mobile: 2324353,
//     email: "sayamc@gmail.com",
//     password: "djsdgjsgjdhkdksdha",
//   });

//   //console.log(result);
//   res.json({ data: "send" });
// });

const PORT = "8000";

app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
