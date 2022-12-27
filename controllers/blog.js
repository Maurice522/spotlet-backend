"use strict";

const Blog = require("../models/Blog");

// const fireAdmin = require("firebase-admin");
// const db = fireAdmin.firestore();
// const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
// const storage = require("../firebase");

const createBlog = async (req, res) => {
    try {
        const newBlog = new Blog({
            title: req.body.title,
            image: req.body.image,
            subheading: req.body.subheading,
            date: req.body.date,
            content: req.body.content,
            likes: {},
            comments: {}
        });
        const createdBlog = await newBlog.save();
        return res.status(200).send("Blog is created");
    } catch (error) {
        return res.status(400).send(error);
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ "timestamp": -1 });;

        res.status(200).send(blogs);

    } catch (error) {
        return res.status(400).send(error);
    }
}

// const uploadBlogPics = async (req, res) => {
//     try {
//         const file = req.file;
//         const imageRef = ref(storage, `blogs/${file.name}`);
//         const metatype = { contentType: file.mimetype, name: file.name };
//         const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
//         const url = await getDownloadURL(imageRef);
//         return res.status(200).json({ message: "uploaded...", url: url, fileRef: imageRef });
//     } catch (error) {
//         console.log(error);
//         return res.status(400).send(error);
//     }
// };


module.exports = {
    createBlog,
    getBlogs,
    // uploadBlogPics
};
