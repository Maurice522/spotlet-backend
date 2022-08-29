const express = require("express");
const router = express.Router();
const {
  createConversationController,
  getUserInboxController,
  sendMessageController,
  getUserMessagesController,
} = require("../controllers/message");

//Select a user for chat making a room of two
router.post("/conversation/:locationId", createConversationController);

//get  users in inbox of a user
router.get("/conversation/:userId", getUserInboxController);

//send message
router.post("/message", sendMessageController);

//get all message for a particular conversation
router.get("/messages/:conversationId", getUserMessagesController);

module.exports = router;
