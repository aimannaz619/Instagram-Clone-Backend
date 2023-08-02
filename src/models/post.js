const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    caption:{
        type:String,
        // required:true,    
    },
    
  
    
    image:{
        type:String,
        // default:"no photo"

    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    
}, {
    timestamps: true
})

const Posts = mongoose.model("Post",  postSchema )
module.exports = Posts