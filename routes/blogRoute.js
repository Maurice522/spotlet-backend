const express = require("express");
const router = express.Router();
const { createBlog,getBlogs } = require("../controllers/blog");



router.post("/createblog",createBlog);

router.get("/getBlogs",getBlogs);


module.exports = router;