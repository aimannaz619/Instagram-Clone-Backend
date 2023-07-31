const express = require('express')

const router = new express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')
const Posts = require('../models/post')
// const upload = multer({ dest: 'uploads/' });
const fileUpload = require('../middleware/file-upload')

router.post('/createpost',auth , async(req,res)=>{
  // fileUpload.single('image')
    const {caption } = req.body
    if(!caption){
        return res.status(422).json({error:"please add all the fields"})
    }

  const post = new Post({
    ...req.body,
   
    postedBy:req.user._id
  })
  try{
    await post.save()
    res.status(201).send(post)
  }
  catch(e){
    res.status(400).send(e)
  }
})

// router.get('/getallposts' ,auth , async(req , res)=>{

//   const posts = await 
 
// // try {
// //   const posts = await Post.find().populate("postedBy", "_id username");
// //   res.send(posts);
// // } catch (error) {
// //   res.status(500).send(error);

//  }

router.get('/getallposts', async (req, res) => {
  try {
    console.log("Fetching")
    const posts = await Post.find({}); 
    console.log(posts)
    res.send(posts)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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


router.get('/getmyposts', auth, async (req, res) => { 
  try {
      await req.user.populate({
          path: 'posts',     
      })
      res.send(req.user.posts)
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router