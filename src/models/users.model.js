import mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"],
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    // required: true, // consider making optional until upload done
  },
  coverImage: {
    type: String,
  },
  watchHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  }],
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  refreshToken: {
    type: String,
  }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10)
  next();

})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){
  return jwt.sign(
    {
      _id:this._id,
      username:this.username,
      email:this.email,
      fullName:this.fullName,
    },
    process.env.ACCESSS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESSS_TOKEN_EXPIERY,
    }
  )
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
    {
      _id:this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIERY,
    }
  )
}


export const User = mongoose.model("User", userSchema);
