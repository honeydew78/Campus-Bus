import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PastTrainee } from "../models/pastTrainee.models.js";
import { CurrentTrainee } from "../models/currentTrainee.models.js";

const convertToPastTrainee = asyncHandler ( async (req,res) => {
   const {
      applicationId,
      email,
      endDate, 
      workReport
   } = req.body

   if(!applicationId && !email){
      throw new ApiError(400,"application id or email is required")
   }

   const currentTrainee = await CurrentTrainee.findOne({
      $or: [{applicationId},{email}]
   })

   if(!currentTrainee){
      throw new ApiError(404,"current Trainee does not exist")
   }

   const workReportUpload = await uploadOnCloudinary(workReport);
   if (!workReportUpload) {
       throw new ApiError(500, "Failed to upload work report to Cloudinary");
   }

   const pastTraineeData = {
      ...currentTrainee.toObject(), // Copy all fields from newTrainee
      endDate,
      workReport: workReportUpload.url
   }

   delete pastTraineeData.traineePeriod

   if(!pastTraineeData) throw new ApiError(404,'an error occured while changing new to current')

   const pastTrainee = await PastTrainee.create(pastTraineeData);

   if (!pastTrainee) {
      throw new ApiError(500, "Failed to create past trainee");
   }

   const deleteTrainee = await CurrentTrainee.findByIdAndDelete(id);

   if(!deleteTrainee) throw new ApiError(500,"User could not be deleted")
   
   return res
   .status(201)
   .json(
      new ApiResponse(
         201,
         pastTrainee,
         "Converted to past trainee successfully")
     );
})

const getAllPastTrainee = asyncHandler ( async(_,res) => {
   const pastTrainees = await CurrentTrainee.find()
   if(!pastTrainees) throw new ApiError(404,"no past trainees found")
 
   return res
   .status(200)
   .json(
    new ApiResponse(
       200,
       pastTrainees,
       "List of all past Trainees"
    )
   )
})

const getPastTrainee = asyncHandler ( async(req,res) => {
   const {id} = req.params
 
   const pastTrainee = await PastTrainee.findById(id).lean();
   if(!pastTrainee) throw new ApiError(404,"Trainee does not exist")
   console.log(pastTrainee)
   
   return res
   .status(200)
   .json(
     new ApiResponse(
       200,
       pastTrainee,
       "past trainee recieved successfully"
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
      mentor,
      departement,
      topicOfPursue,
      endDate
   } = req.body

   const pastTrainee = await PastTrainee.findById(id)
   if(!pastTrainee) throw new ApiError(404,"Past Trainee does not exist")

   let updatedPastTrainee = pastTrainee
   if(fullName) pastTrainee.fullName = fullName;
   if(fatherName) pastTrainee.fatherName = fatherName;
   if(dob) pastTrainee.dob = dob;
   if(aadhar) pastTrainee.aadhar = aadhar;
   if(email) pastTrainee.email = email;
   if(phone) pastTrainee.phone = phone;
   if(address) pastTrainee.address = address;
   if(city) pastTrainee.city = city;
   if(institute) pastTrainee.institute = institute;
   if(branch) pastTrainee.branch = branch;
   if(establishment) pastTrainee.establishment = establishment;
   if(timeOfJoin) pastTrainee.timeOfJoin = timeOfJoin;
   if(cgpa) pastTrainee.cgpa = cgpa;
   if(yearOfStudy) pastTrainee.yearOfStudy = yearOfStudy;
   if(endDate) pastTrainee.endDate = endDate;
   if(mentor) pastTrainee.mentor = mentor;
   if(departement) pastTrainee.departement = departement;
   if(topicOfPursue) pastTrainee.topicOfPursue = topicOfPursue;

   updatedPastTrainee = await pastTrainee.save();
   if(!updatedPastTrainee) throw new ApiError(500,"Something went wrong while updating")
   console.log(updatedPastTrainee)

   return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         updatedPastTrainee,
         "Details Updated"
      )
   )

})

const deletePastTrainee = asyncHandler ( async(req,res) => {
   const {id} = req.params
   const pastTrainee = PastTrainee.findById(id)
   if(!pastTrainee) throw new ApiError(404,"Trainee does not exist")

   await pastTrainee.remove()
   
   return res
   .status(200)
   .json(
     new ApiResponse(
       200,
       null,
       "Past trainee deleted successfully"
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
   const pastTrainee = await PastTrainee.findById(id);
   if (!pastTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new avatar to Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if (!avatar) {
       throw new ApiError(500, "Failed to upload avatar to Cloudinary");
   }

   // Delete the old avatar from Cloudinary, if it exists
   if (pastTrainee.avatarPublicId) {
       await deleteFromCloudinary(pastTrainee.avatarPublicId);
   }

   // Update the trainee's avatar URL and public ID in the database
   pastTrainee.avatar = avatar.url;
   pastTrainee.avatarPublicId = avatar.public_id;
   const updatedTrainee = await pastTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's avatar");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, pastTrainee, "Avatar updated successfully")
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
   const pastTrainee = await PastTrainee.findById(id);
   if (!pastTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new resume to Cloudinary
   const resume = await uploadOnCloudinary(resumeLocalPath);
   if (!resume) {
       throw new ApiError(500, "Failed to upload resume to Cloudinary");
   }

   // Delete the old resume from Cloudinary, if it exists
   if (pastTrainee.resumePublicId) {
       await deleteFromCloudinary(pastTrainee.resumePublicId);
   }

   // Update the trainee's resume URL and public ID in the database
   pastTrainee.resume = resume.url;
   pastTrainee.resumePublicId = resume.public_id;
   const updatedTrainee = await pastTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's resume");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, pastTrainee, "Resume updated successfully")
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
   const pastTrainee = await PastTrainee.findById(id);
   if (!pastTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new charCertificate to Cloudinary
   const charCertificate = await uploadOnCloudinary(charCertificateLocalPath);
   if (!charCertificate) {
       throw new ApiError(500, "Failed to upload character certificate to Cloudinary");
   }

   // Delete the old charCertificate from Cloudinary, if it exists
   if (pastTrainee.charCertificatePublicId) {
       await deleteFromCloudinary(pastTrainee.charCertificatePublicId);
   }

   // Update the trainee's charCertificate URL and public ID in the database
   pastTrainee.charCertificate = charCertificate.url;
   pastTrainee.charCertificatePublicId = charCertificate.public_id;
   const updatedTrainee = await pastTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's character certificate");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, pastTrainee, "Character certificate updated successfully")
   );
});

const updateWorkReport = asyncHandler(async (req, res) => {
   const { id } = req.params;

   // Check if the work report file is included in the request
   const workReportLocalPath = req.file?.path;
   if (!workReportLocalPath) {
       throw new ApiError(400, "Work report file is required");
   }

   // Find the past trainee by ID
   const pastTrainee = await PastTrainee.findById(id);
   if (!pastTrainee) {
       throw new ApiError(404, "Past trainee not found");
   }

   // Upload the new work report to Cloudinary
   const workReport = await uploadOnCloudinary(workReportLocalPath);
   if (!workReport) {
       throw new ApiError(500, "Failed to upload work report to Cloudinary");
   }

   // Delete the old work report from Cloudinary, if it exists
   if (pastTrainee.workReportPublicId) {
       await deleteFromCloudinary(pastTrainee.workReportPublicId);
   }

   // Update the past trainee's work report URL and public ID in the database
   pastTrainee.workReport = workReport.url;
   pastTrainee.workReportPublicId = workReport.public_id;
   const updatedTrainee = await pastTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's work report");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, pastTrainee, "Work report updated successfully")
   );
});

export {
   convertToPastTrainee,
   getAllPastTrainee,
   getPastTrainee,
   updateAccountDetails,
   deletePastTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate,
   updateWorkReport
}