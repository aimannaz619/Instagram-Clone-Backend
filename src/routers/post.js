const express = require("express");

const router = new express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");
const Posts = require("../models/post");
// const upload = multer({ dest: 'uploads/' });
const fileUpload = require("../middleware/file-upload");

// router.post('/createpost' , async(req,res)=>{

//   try{
//     // await post.save()
//     res.status(201).send("sEND")
//   }
//   catch(e){
//     res.status(400).send(e)
//   }
// })

// router.post(
//   "/createpost",
//   auth,
//   fileUpload.single("image"),
//   async (req, res) => {
//     const { caption } = req.body;
//     if (!caption) {
//       return res.status(422).json({ error: "please add all the fields" });
//     }
//     console.log(req.file.filename);
//     if (!req.file) {
//       console.log("file not uploaded ");
//     }
//     const imageFileName = req.file.filename;
//     console.log("imageFileName " + imageFileName);

//     const post = new Post({
//       // ...req.body,
//       // imageFileName: req.file.filename,
//       caption , 
//       imageFileName,

//       postedBy: req.user._id,
//     });
//     try {
//       res.status(201).send(post);
//       await post.save();
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   }
// );
router.post(
  "/createpost",
  auth,
  fileUpload.single("image"),
  async (req, res) => {
    const { caption } = req.body;
    if (!caption || !req.file) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    const imageFileName = req.file.filename;
    console.log("imageFileName: " + imageFileName);

    const post = new Post({
      caption,
      image:imageFileName,
      postedBy: req.user._id,
    });

    try {
      await post.save();
      res.status(201).json(post);
    } catch (e) {
      res.status(400).json({ error: "Error saving post to the database" });
    }
  }
);


// router.get('/getallposts' ,auth , async(req , res)=>{

//   const posts = await

// // try {
// //   const posts = await Post.find().populate("postedBy", "_id username");
// //   res.send(posts);
// // } catch (error) {
// //   res.status(500).send(error);

//  }

router.get("/getallposts", async (req, res) => {
  try {
    console.log("Fetching");

    const posts = await Post.find({});

    const postsWithImageUrl = posts.map((post) => ({
      _id: post._id,
      caption: post.caption,
      // imageUrl: post.imageFileName
      imageUrl: `http://localhost:3000/backend/uploads/${post.imageFileName}`,
    }));
    res.send(postsWithImageUrl);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const posts = await Post.find().populate("postedBy")

// // const posts = await Post.find().populate("postedBy" , "_id username")
// try{
//   res.send(posts)
// }
// catch(e){
//   res.status(500).send(e)
// }
// Post.find().populate("postedBy" , "_id username").then((posts)=>{
//     res.send(posts)
// }).catch((e)=>{
//     res.status(500).send(e)
// })

// ALTERNATIVE WAY TO GET POSTS OF A USER

// // router.get('/mypost' ,auth, async (req , res)=>{
// //   Post.find({postedBy:req.user._id}).populate("postedBy" , "_id username").then(mypost=>{
// //     res.json({mypost})
// //   })
// //   .catch(error =>{
// //     console.log(error)
// //   })
// // })

router.get("/getmyposts", auth, async (req, res) => {
  try {
    await req.user.populate({
      path: "posts",
    });
    res.send(req.user.posts);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
