import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewTrainee } from "../models/newTrainee.models.js";
import { CurrentTrainee } from "../models/currentTrainee.models.js";

const convertToCurrentTrainee = asyncHandler (async (req,res) => {
   const {
      applicationId,
      email,
      cgpa,
      yearOfStudy,
      traineePeriod,
      mentor,
      departement,
      topicOfPursue
   } = req.body

   if(!applicationId && !email){
      throw new ApiError(400,"application id or email is required")
   }

   const newTrainee = await NewTrainee.findOne({
      $or: [{applicationId},{email}]
   })

   if(!newTrainee){
      throw new ApiError(404,"new Trainee does not exist")
   }

   const currentTraineeData = {
      ...newTrainee.toObject(), // Copy all fields from newTrainee
      cgpa, // Additional fields specific to currentTrainee
      yearOfStudy,
      traineePeriod,
      mentor,
      departement,
      topicOfPursue
   };

   if(!currentTraineeData) throw new ApiError(404,'an error occured while changing new to current')

   const currentTrainee = await CurrentTrainee.create(currentTraineeData)

   if(!currentTrainee) throw new ApiError(404,'an error occured while uploading current trainee')

   const deleteTrainee = await NewTrainee.findOneAndDelete(newTrainee)

   if(!deleteTrainee) throw new ApiError(500,"User could not be deleted")

   return res
   .status(201)
   .json(
      new ApiResponse(
         200,
         currentTrainee,
         "current trainee registered and new one deleted"
      )
   )
})

const getAllCurrentTrainee = asyncHandler ( async(_,res) => {
   const currentTrainees = await CurrentTrainee.find()
   if(!currentTrainees) throw new ApiError(404,"no new trainees found")
 
   return res
   .status(200)
   .json(
    new ApiResponse(
       200,
       currentTrainees,
       "List of all new Trainees"
    )
   )
 })
 
 const getCurrentTrainee = asyncHandler ( async(req,res) => {
   const {id} = req.params
 
   const currentTrainee = await CurrentTrainee.findById(id).lean();
   if(!currentTrainee) throw new ApiError(404,"Trainee does not exist")
   console.log(currentTrainee)
   
   return res
   .status(200)
   .json(
     new ApiResponse(
       200,
       currentTrainee,
       "current trainee recieved successfully"
     )
   )
 })
 
 const updateAccountDetails = asyncHandler ( async(req,res) => {
    const { id } = req.params;
    const {
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
       cgpa,
       yearOfStudy,
       traineePeriod,
       mentor,
       departement,
       topicOfPursue
    } = req.body
 
    // if(!applicationId) throw new ApiError(400,"Application Id not recieved")
    
    // const newTrainee = await NewTrainee.findOne({applicationId})
    const currentTrainee = await CurrentTrainee.findById(id)
    if(!currentTrainee) throw new ApiError(404,"Current Trainee does not exist")
 
    let updatedCurrentTrainee = currentTrainee
    if(fullName) currentTrainee.fullName = fullName;
    if(fatherName) currentTrainee.fatherName = fatherName;
    if(dob) currentTrainee.dob = dob;
    if(aadhar) currentTrainee.aadhar = aadhar;
    if(email) currentTrainee.email = email;
    if(phone) currentTrainee.phone = phone;
    if(address) currentTrainee.address = address;
    if(city) currentTrainee.city = city;
    if(institute) currentTrainee.institute = institute;
    if(branch) currentTrainee.branch = branch;
    if(establishment) currentTrainee.establishment = establishment;
    if(timeOfJoin) currentTrainee.timeOfJoin = timeOfJoin;
    if(cgpa) currentTrainee.cgpa = cgpa;
    if(yearOfStudy) currentTrainee.yearOfStudy = yearOfStudy;
    if(traineePeriod) currentTrainee.traineePeriod = traineePeriod;
    if(mentor) currentTrainee.mentor = mentor;
    if(departement) currentTrainee.departement = departement;
    if(topicOfPursue) currentTrainee.topicOfPursue = topicOfPursue;

    updatedCurrentTrainee = await currentTrainee.save();
    if(!updatedCurrentTrainee) throw new ApiError(500,"Something went wrong while updating")
    console.log(updatedCurrentTrainee)
 
    return res
    .status(200)
    .json(
       new ApiResponse(
          200,
          updatedCurrentTrainee,
          "Details Updated"
       )
    )
 
 })
 
 const deleteCurrentTrainee = asyncHandler ( async(req,res) => {
    const {id} = req.params
    const currentTrainee = CurrentTrainee.findById(id)
    if(!currentTrainee) throw new ApiError(404,"Trainee does not exist")
 
    await currentTrainee.remove()
    
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Current trainee deleted successfully"
      )
    )
 })

export {
   convertToCurrentTrainee,
   getAllCurrentTrainee,
   getCurrentTrainee,
   updateAccountDetails,
   deleteCurrentTrainee
}