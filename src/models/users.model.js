import mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required:true,
    lowerCase:true,
    trim:true,
    index:true,
    unique:true,
  },
    email: {
    type: String,
    required:true,
    lowerCase:true,
    trim:true,
    unique:true,

  },
    fullName: {
    type: String,
    required:true,
    lowerCase:true,
    trim:true,
  },
  avatar: {
    type:String, // cloudinary url
    required:true,

  },
  coverImage: {
    type:String, // cloudinary url
  },
  watchHistory: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Video",
    }
  ],
  password: {
    type:String,
    required:[true, "Password is required"],
    minLength:[6, "Password must be at least 6 characters long"],
  },
  refreshToken: {
    type:String,

  }



}, {timestamps:true});

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
    process.env.ACCESSSS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESSSS_TOKEN_EXPIERY,
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
