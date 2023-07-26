const express = require('express')
const app = express()
const port = process.env.PORT  || 3000
require('./db/mongoose')
const User = require('./models/user')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const multer  = require('multer')
const path = require('path');




app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });


  // server.js

// ... (Existing code)

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use(userRouter)
app.use(postRouter)


app.listen(port , ()=>{
    console.log("Server is up on port "+ port)
})