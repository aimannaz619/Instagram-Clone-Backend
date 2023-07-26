const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const userSchema = new mongoose.Schema(
//     {
//         userName:{
//             type:String,
//             required:true,
//             trim:true
//         },

//         email:{
//             type:String,
//             required:true,
//             unique:true,
//             trim:true,
//             lowercase:true,
//             validate(value){
//                 if(!validator.isEmail(value)){
//                     throw new Error("Email is invalid")
//                 }
//             }

//         },

//         password:
//         {
//             type:String,
//             required:true
//         },
//         tokens: [{
//             token: {
//                 type: String,
//                 required: true
//             }
//         }]
//     })

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
}, {
  timestamps: true
})

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'postedBy'
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("unable to login");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("unable to login");
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
