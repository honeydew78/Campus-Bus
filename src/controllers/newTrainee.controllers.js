import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewTrainee } from "../models/newTrainee.models.js";

const registerNewTrainee = asyncHandler ( async(req,res) => {
   const {
      applicationId,
      fullName,
      fatherName,
      dob,
      aadhar,
      email,
      phone,
      address,
      city,
      institute,
      branch,
      establishment,
      timeOfJoin
   } = req.body

   // if(
   //    [
   //    applicationId,
   //    fullName,
   //    fatherName,
   //    dob,
   //    aadhar,
   //    email,
   //    phone,
   //    address,
   //    city,
   //    institute,
   //    branch,
   //    center,
   //    timeOfJoin
   //    ].some((field) => field?.trim() === "")
   // ){
   //    throw new ApiError(400,"All fields are required")
   // }

   const existedNewTrainee = await NewTrainee.findOne({applicationId})

   if(existedNewTrainee){
      throw new ApiError(409,"Trainee already registered")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path
   const charCertificateLocalPath = req.files?.charCertificate[0]?.path
   const resumeLocalPath = req.files?.resume[0]?.path

   if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")
   if(!charCertificateLocalPath) throw new ApiError(400,"char certificate file is required")
   if(!resumeLocalPath) throw new ApiError(400,"resume file is required")

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const charCertificate = await uploadOnCloudinary(charCertificateLocalPath)
   const resume = await uploadOnCloudinary(resumeLocalPath)

   if(!avatar) throw new ApiError(400,"Avatar file is required (cloud)")
   if(!charCertificate) throw new ApiError(400,"char certificate file is required (cloud)")
   if(!resume) throw new ApiError(400,"Resume file is required (cloud)")

   const newTrainee = await NewTrainee.create({
      applicationId,
      fullName,
      fatherName,
      dob,
      aadhar,
      email,
      phone,
      address,
      city,
      institute,
      branch,
      establishment,
      timeOfJoin,
      avatar: avatar.url,
      charCertificate : charCertificate.url,
      resume: resume.url
   })

   const createdNewTrainee = await NewTrainee.findById(newTrainee._id)

   if(!createdNewTrainee) throw new ApiError(500,"Something went wrong while registering new Trainee")
   
   return res
   .status(201)
   .json(
      new ApiResponse(
        200,
        createdNewTrainee,
        "New Trainee registered successfully"
      )
   )
})

const updateAccountDetails = asyncHandler ( async(req,res) => {
   const {
      applicationId,
      fullName
   } = req.body

   if(!applicationId) throw new ApiError(400,"Application Id not recieved")
   
   const newTrainee = await NewTrainee.findOne({applicationId})

   if(!newTrainee) throw new ApiError(404,"New Trainee does not exist")

  
   if(fullName){
      newTrainee.fullName = fullName;
      const updatedNewTrainee = await newTrainee.save();
      if(!updatedNewTrainee) throw new ApiError(500,"Something went wrong while changing fullname")
   }

   return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         updatedNewTrainee,
         "Details Updated"
      )
   )

})

export {
   registerNewTrainee,
   updateAccountDetails
}