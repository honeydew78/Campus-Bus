import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
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

const updateAvatar = asyncHandler(async (req, res) => {
   const { id } = req.params;

   // Check if the avatar file is included in the request
   const avatarLocalPath = req.file?.path;
   if (!avatarLocalPath) {
       throw new ApiError(400, "Avatar file is required");
   }

   // Find the trainee by ID
   const currentTrainee = await CurrentTrainee.findById(id);
   if (!currentTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new avatar to Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if (!avatar) {
       throw new ApiError(500, "Failed to upload avatar to Cloudinary");
   }

   // Delete the old avatar from Cloudinary, if it exists
   if (currentTrainee.avatarPublicId) {
       await deleteFromCloudinary(currentTrainee.avatarPublicId);
   }

   // Update the trainee's avatar URL and public ID in the database
   currentTrainee.avatar = avatar.url;
   currentTrainee.avatarPublicId = avatar.public_id;
   const updatedTrainee = await currentTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's avatar");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, updatedTrainee, "Avatar updated successfully")
   );
});

const updateResume = asyncHandler(async (req, res) => {
   const { id } = req.params;

   // Check if the resume file is included in the request
   const resumeLocalPath = req.file?.path;
   if (!resumeLocalPath) {
       throw new ApiError(400, "Resume file is required");
   }

   // Find the trainee by ID
   const currentTrainee = await CurrentTrainee.findById(id);
   if (!currentTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new resume to Cloudinary
   const resume = await uploadOnCloudinary(resumeLocalPath);
   if (!resume) {
       throw new ApiError(500, "Failed to upload resume to Cloudinary");
   }

   // Delete the old resume from Cloudinary, if it exists
   if (currentTrainee.resumePublicId) {
       await deleteFromCloudinary(currentTrainee.resumePublicId);
   }

   // Update the trainee's resume URL and public ID in the database
   currentTrainee.resume = resume.url;
   currentTrainee.resumePublicId = resume.public_id;
   const updatedTrainee = await currentTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's resume");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, updatedTrainee, "Resume updated successfully")
   );
});

const updateCharCertificate = asyncHandler(async (req, res) => {
   const { id } = req.params;

   // Check if the charCertificate file is included in the request
   const charCertificateLocalPath = req.file?.path;
   if (!charCertificateLocalPath) {
       throw new ApiError(400, "Character certificate file is required");
   }

   // Find the trainee by ID
   const currentTrainee = await CurrentTrainee.findById(id);
   if (!currentTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new charCertificate to Cloudinary
   const charCertificate = await uploadOnCloudinary(charCertificateLocalPath);
   if (!charCertificate) {
       throw new ApiError(500, "Failed to upload character certificate to Cloudinary");
   }

   // Delete the old charCertificate from Cloudinary, if it exists
   if (currentTrainee.charCertificatePublicId) {
       await deleteFromCloudinary(currentTrainee.charCertificatePublicId);
   }

   // Update the trainee's charCertificate URL and public ID in the database
   currentTrainee.charCertificate = charCertificate.url;
   currentTrainee.charCertificatePublicId = charCertificate.public_id;
   const updatedTrainee = await currentTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's character certificate");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, updatedTrainee, "Character certificate updated successfully")
   );
});

export {
   convertToCurrentTrainee,
   getAllCurrentTrainee,
   getCurrentTrainee,
   updateAccountDetails,
   deleteCurrentTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate
}