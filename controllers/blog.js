"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = require("../firebase");

const createBlog = async (req, res) => {
    try {
        const { title, image, subheading, date, content } = req.body;
        const data = { title, image, subheading, date, content, likes: {}, comments: {} };
        await db.collection("blogs").doc().set(data);
        return res.send("Blog is created");
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const getBlogs = async (req, res) => {
    try {
        // console.log(req.body);
        const user = await db.collection("blogs").get();
        const oo = user.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        res.status(200).send(oo);

    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const uploadBlogPics = async (req, res) => {
    try {
        const file = req.file;
        const imageRef = ref(storage, `blogs/${file.name}`);
        const metatype = { contentType: file.mimetype, name: file.name };
        const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
        const url = await getDownloadURL(imageRef);
        return res.status(200).json({ message: "uploaded...", url: url, fileRef: imageRef });
    } catch (error) {
        console.log(error);
        return res.status(422).send(error);
    }
};


module.exports = {
    createBlog, getBlogs, uploadBlogPics
};
