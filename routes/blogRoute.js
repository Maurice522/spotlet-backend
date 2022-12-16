const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createBlog, getBlogs, uploadBlogPics } = require("../controllers/blog");
const memoStorage = multer.memoryStorage();

const upload = multer({ memoStorage });


router.post("/createblog", createBlog);

router.get("/getBlogs", getBlogs);

router.post("/uploadblogpic", upload.single("pic"), uploadBlogPics);

module.exports = router;