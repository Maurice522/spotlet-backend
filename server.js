const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');

dotenv.config();
const PORT = process.env.PORT || "7000";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(console.log('connected to mongodb'))
  .catch((err) => console.log(err));

app.use(require("./routes/userRoute"));
app.use(require("./routes/locationRoute"));
app.use(require("./routes/requestsRoute"));
app.use(require("./routes/messageRoute"));
app.use(require("./routes/bookingRoute"));
app.use(require("./routes/contactUsRoute"));
app.use(require("./routes/blogRoute"));
app.use(require("./routes/adminRoute"))
app.use(require("./routes/dropdownRoute"))
app.use(require("./routes/transactionRoute"))


var server = app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});

//////Socket////
var io = require("socket.io")(server, {
  cors: "*",
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  // console.log("a user connected");
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const user = getUser(receiverId);
    console.log(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      message,
    });
  });
  //when disconnect
  socket.on("disconnect", () => {
    // console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
