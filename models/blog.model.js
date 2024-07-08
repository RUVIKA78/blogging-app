const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required:true,
        },
        body: {
            type: String,
            required:true,
        },
        blogImage: {
            type: String,
        }, 
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }

    },
    
    { timestamp: true })
    
const Blog = mongoose.model("blog", blogSchema)
    
module.exports=Blog