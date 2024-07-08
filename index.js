const express = require("express")
const path = require("path")
const PORT=4000
const userRouter = require('./routes/user')
const blogRouter=require("./routes/blog.route")
const app = express()
const mongoose = require("mongoose")
const cookieParser=require("cookie-parser")
const { checkforAuthCookie } = require("./middlewares/authentication")
const Blog = require("./models/blog.model")
const User = require("./models/user.model")
const bodyParser = require("body-parser")

app.use(express.static(path.resolve(__dirname, "public")))

mongoose.connect('mongodb://localhost:27017/blogify')
    .then(
    console.log("mongodb connection established")
)

app.set("view engine", "ejs")
app.set("views", path.resolve
("./views"))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(checkforAuthCookie("token"));

app.use("/user", userRouter)
app.use("/blog", blogRouter)

app.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({})
        

        res.render("home", {

            blogs: allBlogs,
            user: req.user, 
            
        })

        
    }
    catch (error) {

        console.error('Error fetching blogs:', error);

    }
    })



app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})