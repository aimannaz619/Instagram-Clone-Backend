const express = require("express");

const router = new express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");
const Posts = require("../models/post");
// const upload = multer({ dest: 'uploads/' });
const fileUpload = require("../middleware/file-upload");

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
    console.log(req.file.path);
    const imageUrl = "uploads/" + req.file.filename;
    const post = new Post({
      caption,
      image: imageUrl,
      postedBy: req.user._id,
    });

    try {
      await post.save();
      res.status(201).send("Post created");
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
      // imageUrl: post.image
      // imageUrl: `http://localhost:3000/src/uploads/6cc90324-cd21-4792-a125-485e8f19273c.jpeg`,
      imageUrl: post.image,
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
    const posts = req.user.posts
    const postsWithImageUrl = posts.map((post) => ({
      _id: post._id,
      caption: post.caption,
      // imageUrl: post.image
      // imageUrl: `http://localhost:3000/src/uploads/6cc90324-cd21-4792-a125-485e8f19273c.jpeg`,
      imageUrl: post.image,
    }));
    res.send(postsWithImageUrl);
  } catch (e) {
    res.status(500).send();
  }
});

// router.get("/getmyposts", auth, async (req, res) => {
//   try {
//     await req.user.populate("posts");

//     const myPosts = req.user.posts.map((post) => ({
//       _id: post._id,
//       caption: post.caption,
//       imageUrl: post.image,
//     }));

//     res.send(myPosts);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


router.patch('/posts/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)

  try {
    const post = await Post.findOne({ _id: req.params.id, postedBy: req.user._id })
  
  if (!post) {
    return res.status(404).send()
  }
  updates.forEach((update) => {
    post[update] = req.body[update]
  })
  await post.save()
  res.send(post)
 }
  catch (e) {
    res.status(400).send(e)
}
  

})

module.exports = router;
