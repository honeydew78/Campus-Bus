import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminSchema = new Schema(
   {
     username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
     },
     email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
     },
     fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
     },
     avatar: {
      type: String, //cloudinary url
      required: true,
     },
     password: {
      type: String,
      required: [true, 'Password is required']
     },
     refreshToken: {
      type: String
     }
   },
   {
     timestamps: true
   }
)

adminSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})//password encrypted (by hooks in middleware)

adminSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}//check password is correct

adminSchema.methods.generateAccessToken = function(){
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username,
         fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}
adminSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
      {
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}

export const Admin = mongoose.model("Admin",adminSchema)