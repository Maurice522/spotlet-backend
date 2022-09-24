"use strict";

const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const createConversationController = async (req, res) => {
  try {
    const { senderId, receiverId, locationId } = req.body;
    const bookingId = req.params.bookingId;
    const snapshot = await db
      .collection("conversations")
      .where("members", "array-contains", receiverId)
      .where("bookingId", "==", bookingId)
      .get();
    let present = false;
    snapshot.docs.map((doc) => {
      if (doc.data().members.includes(senderId)) present = true;
    });
    if (present) return res.json({ message: "already present" });
    //console.log(db.FieldValue.serverTimestamp());
    const snapshot1 = await db.collection("users").doc(senderId).get();
    const snapshot2 = await db.collection("users").doc(receiverId).get();
    const senderUserProfile = snapshot1.data();
    const receiverUserProfile = snapshot2.data();
    //  console.log(receiverUserProfile);
    const data = {
      timestamp: new Date(),
      members: [senderId, receiverId],
      bookingId,
      locationId,
      users: {
        [senderId]: senderUserProfile,
        [receiverId]: receiverUserProfile,
      },
    };
    await db.collection("conversations").doc().set(data);
    return res.status(200).json({ message: "created room" });
  } catch (error) {
    return res.status(422).json(error);
  }
};

const getUserInboxController = async (req, res) => {
  try {
    const snapshot = await db
      .collection("conversations")
      .where("members", "array-contains", req.params.userId)
      .orderBy("timestamp", "desc")
      .get();
    const users = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(422).json(error);
  }
};

const sendMessageController = async (req, res) => {
  const { message, senderId, conversationId } = req.body;
  const newMessage = {
    timestamp: new Date(),
    senderId,
    message,
  };
  try {
    await db
      .collection("conversations")
      .doc(conversationId)
      .collection("messages")
      .doc()
      .set(newMessage);
    return res.status(200).json({ message: "message sent" });
  } catch (error) {
    return res.status(422).json(error);
  }
};

const getUserMessagesController = async (req, res) => {
  try {
    const snapshot = await db
      .collection("conversations")
      .doc(req.params.conversationId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .get();
    const data = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return res.status(200).send(data);
  } catch (error) {
    return res.status(422).json(error);
  }
};

module.exports = {
  createConversationController,
  getUserInboxController,
  sendMessageController,
  getUserMessagesController,
};
