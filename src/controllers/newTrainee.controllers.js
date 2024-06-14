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

const getNewTraineeById = asyncHandler ( async(req,res) => {
  const {email,applicationId} = req.body

  if(!email && !applicationId) throw new ApiError(400,"Email or Application Id not recieved")

  const newTrainee = await NewTrainee.findOne({
   $or: [{email},{applicationId}]
  })

  if(!newTrainee) throw new ApiError(404,"Trainee does not exist")
  
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      newTrainee,
      "New trainee recieved successfully"
    )
  )
})

const updateAccountDetails = asyncHandler ( async(req,res) => {
   // const { id } = req.params;
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

   if(!applicationId) throw new ApiError(400,"Application Id not recieved")
   
   const newTrainee = await NewTrainee.findOne({applicationId})
   // const newTrainee = await NewTrainee.findById(id)
   if(!newTrainee) throw new ApiError(404,"New Trainee does not exist")

   let updatedNewTrainee = newTrainee
   if(fullName) newTrainee.fullName = fullName;
   if(fatherName) newTrainee.fatherName = fatherName;
   if(dob) newTrainee.dob = dob;
   if(aadhar) newTrainee.aadhar = aadhar;
   if(email) newTrainee.email = email;
   if(phone) newTrainee.phone = phone;
   if(address) newTrainee.address = address;
   if(city) newTrainee.city = city;
   if(institute) newTrainee.institute = institute;
   if(branch) newTrainee.branch = branch;
   if(establishment) newTrainee.establishment = establishment;
   if(timeOfJoin) newTrainee.timeOfJoin = timeOfJoin;

   updatedNewTrainee = await newTrainee.save();
   if(!updatedNewTrainee) throw new ApiError(500,"Something went wrong while updating")
   

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

const deleteNewtrainee = asyncHandler ( async(req,res) => {
   const {email,applicationId} = req.body

   if(!email && !applicationId) throw new ApiError(400,"Email or Application Id not recieved")
 
   const newTrainee = await NewTrainee.findOne({
    $or: [{email},{applicationId}]
   })
 
   if(!newTrainee) throw new ApiError(404,"Trainee does not exist")

   await newTrainee.remove()
   
   return res
   .status(200)
   .json(
     new ApiResponse(
       200,
       null,
       "New trainee deleted successfully"
     )
   )
})

const changeDummy = asyncHandler ( async(_,res) => {
  const applicationId = '1234'

  const trainee = await NewTrainee.findOne({applicationId})

  const fullName = "Agrim Raj"
  
  trainee.fullName = fullName
  const updatedTrainee = await trainee.save();
   if(!updatedTrainee) throw new ApiError(500,"Something went wrong while updating")
  
   return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         updatedTrainee,
         "changed"
      )
   )
})

export {
   registerNewTrainee,
   getNewTraineeById,
   updateAccountDetails,
   deleteNewtrainee,
   changeDummy
}