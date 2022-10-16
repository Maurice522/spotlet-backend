"use strict";
const fireAdmin = require("firebase-admin");
const db = fireAdmin.firestore();

const createBlog = async (req, res) => {
    try {
        const{title,img,subheading,date,content}=req.body;
        const data = {title,img,subheading,date,content,likes:{},comments:{}};
        await db.collection("blogs").doc().set(data);
        return res.send("Blog is created");
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const getBlogs=async(req,res)=>{
    try {
        const user = await db.collection("blogs").get();
        const oo = user.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        res.status(200).send(oo);

    } catch (error) {
        return res.status(400).send(error.message);
    }
}



module.exports = {
    createBlog,getBlogs
};
