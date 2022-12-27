"use strict";

// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();
const User = require("../models/User");
const Conversation = require("../models/Conversation");

const createConversationController = async (req, res) => {
  try {
    const { senderId, receiverId, locationId } = req.body;
    const bookingId = req.params.bookingId;

    let present = false;
    const conversations = await Conversation.find({ bookingId: bookingId }).sort({ "timestamp": -1 });;

    conversations.map((convo) => {
      if (convo.members.includes(senderId)) {
        present = true;
      }
    })

    if (present)
      return res.status(403).json({ message: "already present" });

    const senderUserProfile = await User.findOne({ _id: senderId });
    const receiverUserProfile = await User.findOne({ _id: receiverId });

    const newConversation = new Conversation({
      members: [senderId, receiverId],
      bookingId,
      locationId,
      users: {
        [senderId]: senderUserProfile,
        [receiverId]: receiverUserProfile,
      },
      messages: []
    });
    await newConversation.save()
    return res.status(200).json({ message: "created room" });
  } catch (error) {
    return res.status(422).json(error);
  }
};

const getUserInboxController = async (req, res) => {
  try {
    const conversations = await Conversation.find({ members: { "$in": [req.params.userId] } }).sort({ "timestamp": -1 });;

    return res.status(200).send(conversations);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const sendMessageController = async (req, res) => {
  try {
    const newMessage = {
      senderId: req.body.senderId,
      message: req.body.message,
      timestamp: Date.now()
    }

    const conversation = await Conversation.findOne({ _id: req.body.conversationId });

    await Conversation.findByIdAndUpdate(conversation._id,
      {
        $set: {
          ...conversation._doc,
          messages: [...conversation.messages, newMessage],
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "message sent" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserMessagesController = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.conversationId });

    return res.status(200).send(conversation.messages);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createConversationController,
  getUserInboxController,
  sendMessageController,
  getUserMessagesController,
};
