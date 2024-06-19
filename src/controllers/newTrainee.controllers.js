import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewTrainee } from "../models/newTrainee.models.js";
import { CurrentTrainee } from "../models/currentTrainee.models.js";

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

const getAllNewTrainee = asyncHandler ( async(_,res) => {
  const newTrainees = await NewTrainee.find()
  if(!newTrainees) throw new ApiError(404,"no new trainees found")

  return res
  .status(200)
  .json(
   new ApiResponse(
      200,
      newTrainees,
      "List of all new Trainees"
   )
  )
})

const getNewTrainee = asyncHandler ( async(req,res) => {
  const {id} = req.params

  const newTrainee = await NewTrainee.findById(id).lean();
  if(!newTrainee) throw new ApiError(404,"Trainee does not exist")
  console.log(newTrainee)
  
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

const findNewTrainee = asyncHandler(async (req, res) => {
  const { email, applicationId } = req.body;

  if (!email && !applicationId) {
    throw new ApiError(400, "Email or Application ID is required");
  }

  let newTrainee;
  if (email) {
    newTrainee = await NewTrainee.findOne({ email }).lean();
  } else if (applicationId) {
    newTrainee = await NewTrainee.findOne({ applicationId }).lean();
  }

  if (!newTrainee) throw new ApiError(404, "Trainee does not exist");

  console.log(newTrainee);

  return res.status(200).json(
    new ApiResponse(
      200,
      newTrainee,
      "New trainee got successfully"
    )
  );
});

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
      timeOfJoin
   } = req.body

   // if(!applicationId) throw new ApiError(400,"Application Id not recieved")
   
   // const newTrainee = await NewTrainee.findOne({applicationId})
   const newTrainee = await NewTrainee.findById(id)
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
   console.log(updatedNewTrainee)

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

const deleteNewTrainee = asyncHandler ( async(req,res) => {
   const {id} = req.params
   const newTrainee = NewTrainee.findById(id)
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

const convertToCurrentTrainee = asyncHandler (async (req,res) => {
   const {
      cgpa,
      yearOfStudy,
      traineePeriod,
      mentor,
      departement,
      topicOfPursue
   } = req.body

   const {id} = req.params
   const newTrainee = NewTrainee.findById(id)

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

const updateAvatar = asyncHandler(async (req, res) => {
   const { id } = req.params;

   // Check if the avatar file is included in the request
   const avatarLocalPath = req.file?.path;
   if (!avatarLocalPath) {
       throw new ApiError(400, "Avatar file is required");
   }

   // Find the trainee by ID
   const newTrainee = await NewTrainee.findById(id);
   if (!newTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new avatar to Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if (!avatar) {
       throw new ApiError(500, "Failed to upload avatar to Cloudinary");
   }

   // Delete the old avatar from Cloudinary, if it exists
   if (newTrainee.avatarPublicId) {
       await deleteFromCloudinary(newTrainee.avatarPublicId);
   }

   // Update the trainee's avatar URL and public ID in the database
   newTrainee.avatar = avatar.url;
   newTrainee.avatarPublicId = avatar.public_id;
   const updatedTrainee = await newTrainee.save();
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
   const newTrainee = await NewTrainee.findById(id);
   if (!newTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new resume to Cloudinary
   const resume = await uploadOnCloudinary(resumeLocalPath);
   if (!resume) {
       throw new ApiError(500, "Failed to upload resume to Cloudinary");
   }

   // Delete the old resume from Cloudinary, if it exists
   if (newTrainee.resumePublicId) {
       await deleteFromCloudinary(newTrainee.resumePublicId);
   }

   // Update the trainee's resume URL and public ID in the database
   newTrainee.resume = resume.url;
   newTrainee.resumePublicId = resume.public_id;
   const updatedTrainee = await newTrainee.save();
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
   const newTrainee = await NewTrainee.findById(id);
   if (!newTrainee) {
       throw new ApiError(404, "Trainee not found");
   }

   // Upload the new charCertificate to Cloudinary
   const charCertificate = await uploadOnCloudinary(charCertificateLocalPath);
   if (!charCertificate) {
       throw new ApiError(500, "Failed to upload character certificate to Cloudinary");
   }

   // Delete the old charCertificate from Cloudinary, if it exists
   if (newTrainee.charCertificatePublicId) {
       await deleteFromCloudinary(newTrainee.charCertificatePublicId);
   }

   // Update the trainee's charCertificate URL and public ID in the database
   newTrainee.charCertificate = charCertificate.url;
   newTrainee.charCertificatePublicId = charCertificate.public_id;
   const updatedTrainee = await newTrainee.save();
   if (!updatedTrainee) {
       throw new ApiError(500, "Failed to update trainee's character certificate");
   }

   // Send a successful response
   return res.status(200).json(
       new ApiResponse(200, updatedTrainee, "Character certificate updated successfully")
   );
});

const countTraineesByCity = asyncHandler(async (_, res) => {
   try {
      const traineesByCity = await NewTrainee.aggregate([
         {
            $group: {
               _id: "$city",
               count: { $sum: 1 },
               traineeIds: { $push: "$_id" } // Collecting trainee IDs in an array
            }
         },
         {
            $project: {
               _id: 0,
               city: "$_id",
               count: 1,
               traineeIds: 1
            }
         }
      ]);

      if (!traineesByCity || traineesByCity.length === 0) {
         throw new ApiError(404, "No trainees found");
      }

      return res.status(200).json(
         new ApiResponse(
            200,
            traineesByCity,
            "Count of trainees by City and their IDs"
         )
      );
   } catch (error) {
      throw new ApiError(500, error.message);
   }
});

const countTraineesByInstitute = asyncHandler(async (_, res) => {
   try {
      const traineesByInstitute = await NewTrainee.aggregate([
         {
            $group: {
               _id: "$institute",
               count: { $sum: 1 },
               traineeIds: { $push: "$_id" } // Collecting trainee IDs in an array
            }
         },
         {
            $project: {
               _id: 0,
               institute: "$_id",
               count: 1,
               traineeIds: 1
            }
         }
      ]);

      if (!traineesByInstitute || traineesByInstitute.length === 0) {
         throw new ApiError(404, "No trainees found");
      }

      return res.status(200).json(
         new ApiResponse(
            200,
            traineesByInstitute,
            "Count of trainees by institute and their IDs"
         )
      );
   } catch (error) {
      throw new ApiError(500, error.message);
   }
});

const countTraineesByBranch = asyncHandler(async (_, res) => {
   try {
      const traineesByBranch = await NewTrainee.aggregate([
         {
            $group: {
               _id: "$branch",
               count: { $sum: 1 },
               traineeIds: { $push: "$_id" } // Collecting trainee IDs in an array
            }
         },
         {
            $project: {
               _id: 0,
               branch: "$_id",
               count: 1,
               traineeIds: 1
            }
         }
      ]);

      if (!traineesByBranch || traineesByBranch.length === 0) {
         throw new ApiError(404, "No trainees found");
      }

      return res.status(200).json(
         new ApiResponse(
            200,
            traineesByBranch,
            "Count of trainees by branch and their IDs"
         )
      );
   } catch (error) {
      throw new ApiError(500, error.message);
   }
});

const countTraineesByTimeOfJoin = asyncHandler(async (_, res) => {
   try {
      const traineesByTimeOfJoin = await NewTrainee.aggregate([
         {
            $group: {
               _id: "$timeOfJoin",
               count: { $sum: 1 },
               traineeIds: { $push: "$_id" } // Collecting trainee IDs in an array
            }
         },
         {
            $project: {
               _id: 0,
               timeOfJoin: "$_id",
               count: 1,
               traineeIds: 1
            }
         }
      ]);

      if (!traineesByTimeOfJoin || traineesByTimeOfJoin.length === 0) {
         throw new ApiError(404, "No trainees found");
      }

      return res.status(200).json(
         new ApiResponse(
            200,
            traineesByTimeOfJoin,
            "Count of trainees by time of join and their IDs"
         )
      );
   } catch (error) {
      throw new ApiError(500, error.message);
   }
});

const countTraineesByEstablishment = asyncHandler(async (_, res) => {
   try {
      const traineesByEstablishment = await NewTrainee.aggregate([
         {
            $group: {
               _id: "$establishment",
               count: { $sum: 1 },
               traineeIds: { $push: "$_id" } // Collecting trainee IDs in an array
            }
         },
         {
            $project: {
               _id: 0,
               establishment: "$_id",
               count: 1,
               traineeIds: 1
            }
         }
      ]);

      if (!traineesByEstablishment || traineesByEstablishment.length === 0) {
         throw new ApiError(404, "No trainees found");
      }

      return res.status(200).json(
         new ApiResponse(
            200,
            traineesByEstablishment,
            "Count of trainees by establishment and their IDs"
         )
      );
   } catch (error) {
      throw new ApiError(500, error.message);
   }
});



export {
   registerNewTrainee,
   getAllNewTrainee,
   findNewTrainee,
   getNewTrainee,
   updateAccountDetails,
   deleteNewTrainee,
   convertToCurrentTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate,
   countTraineesByCity,
   countTraineesByInstitute,
   countTraineesByBranch,
   countTraineesByTimeOfJoin,
   countTraineesByEstablishment
}