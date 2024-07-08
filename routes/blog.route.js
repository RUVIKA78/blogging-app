const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const Blog = require("../models/blog.model")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, `../public/uploads`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})
const upload = multer({ storage: storage })

router.get("/addblog", (req, res) => {
    return res.render("addblog", {
        user: req.user,
    })
})

router.post("/", upload.single('blogImage'), async (req, res) => {
    const { title, body } = req.body
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user.id,
        blogImage: `uploads/${req.file.filename}`
    })
   
    return res.redirect(`/blog/${blog._id}`);
})

router.get("/:_id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params._id).populate("createdBy")
       

        return res.render("blog", {
            user: req.user,
            blog,
        })
    } catch (error) {
        console.log("error from blog route ", error);
    }
})




module.exports = router