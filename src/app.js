const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package
const fs = require("fs");
const app = express();

const corsOrigin = "http://localhost:3001";
app.use(
  cors({
    origin: [corsOrigin],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const uploadsFolder = "./uploads";

// Create the "uploads" folder if it doesn't exist
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// server.js

// ... (Existing code)

// Serve uploaded images
// app.use("./uploads", express.static(path.join(__dirname, "uploads")));
// app.use('./uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("./uploads", express.static(path.join(__dirname, "./uploads")));y

app.use(express.static(__dirname + "/uploads"));
app.use("/uploads", express.static("uploads"));
app.use(userRouter);
app.use(postRouter);
module.exports = app
