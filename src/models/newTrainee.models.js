import mongoose, { Schema } from "mongoose";

const newTraineeSchema = new Schema({
   applicationId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
     },
     fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
     },
     fatherName:{
      type: String,
      required: true
     },
     dob: {
      type: String,
      required: true
     },
     aadhar: {
      type: String,
      unique: true,
      required: true
     },
     email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
     },
     phone: {
      type: String,
      required: true,
      unique: true
     },
     address: {
      type: String,
      required: true
     },
     city:{
      type: String,
      required: true
     },
     institute:{
      type: String,
      required: true
     },
     branch:{
      type: String,
      required: true
     },
     establishment:{
      type: String,
      required: true
     },
     timeOfJoin:{
      type: String,// winter or summer
      required: true
     },
     resume:{
      type: String,// url docs
      required: true
     },
     charCertificate:{
      type: String,// url docs
      required: true
     },
     avatar:{
      type: String, // url cloudinary
      required: true
     }
},{timestamps : true})

export const NewTrainee = mongoose.model("newTrainee",newTraineeSchema)