import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewTrainee } from "../models/newTrainee.models.js";
import { CurrentTrainee } from "../models/currentTrainee.models.js";

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadToLocal = async (file, type) => {
  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    const uploadPath = path.join('uploads', type, fileName); // Save relative path
    const fullUploadPath = path.join(__dirname, '..', uploadPath); // Full path for file operations

    await fs.mkdir(path.dirname(fullUploadPath), { recursive: true });
    await fs.rename(file.path, fullUploadPath);

    return uploadPath; // Return relative path
  } catch (err) {
    console.error('Error uploading file to local storage:', err);
    return null;
  }
};

const registerNewTrainee = asyncHandler(async (req, res) => {
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
    timeOfJoin,
  } = req.body;

  const existedNewTrainee = await NewTrainee.findOne({ applicationId });

  if (existedNewTrainee) {
    throw new ApiError(409, 'Trainee already registered');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const charCertificateLocalPath = req.files?.charCertificate[0]?.path;
  const resumeLocalPath = req.files?.resume[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is required');
  if (!charCertificateLocalPath) throw new ApiError(400, 'char certificate file is required');
  if (!resumeLocalPath) throw new ApiError(400, 'resume file is required');

  // Function to upload files to local storage
  const uploadAvatar = await uploadToLocal(req.files.avatar[0], 'avatar');
  const uploadCharCertificate = await uploadToLocal(req.files.charCertificate[0], 'charCertificate');
  const uploadResume = await uploadToLocal(req.files.resume[0], 'resume');

  if (!uploadAvatar) throw new ApiError(500, 'Failed to upload avatar to local storage');
  if (!uploadCharCertificate) throw new ApiError(500, 'Failed to upload char certificate to local storage');
  if (!uploadResume) throw new ApiError(500, 'Failed to upload resume to local storage');

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
    avatar: uploadAvatar,
    charCertificate: uploadCharCertificate,
    resume: uploadResume,
  });

  if (!newTrainee) throw new ApiError(500, 'Failed to create new Trainee');

  return res.status(201).json(
    new ApiResponse(200, newTrainee, 'New Trainee registered successfully')
  );
});

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
 
   // Function to upload avatar file to local storage
   const uploadAvatar = await uploadToLocal(req.file, 'avatar');
   if (!uploadAvatar) {
     throw new ApiError(500, "Failed to upload avatar to local storage");
   }
 
   // Construct the path to the old avatar file
   const oldAvatarPath = path.join(__dirname, '..', newTrainee.avatar);
 
   // Delete the old avatar file from local storage, if it exists
   if (newTrainee.avatar) {
     try {
       await fs.access(oldAvatarPath); // Check if file exists
       await fs.unlink(oldAvatarPath);
     } catch (err) {
       if (err.code !== 'ENOENT') {
         console.error('Error deleting old avatar file:', err);
       }
     }
   }
 
   // Update the trainee's avatar path in the database
   newTrainee.avatar = uploadAvatar;
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
 
   // Function to upload resume file to local storage
   const uploadResume = await uploadToLocal(req.file, 'resume');
   if (!uploadResume) {
     throw new ApiError(500, "Failed to upload resume to local storage");
   }
 
   // Construct the path to the old resume file
   const oldResumePath = path.join(__dirname, '..', newTrainee.resume);
 
   // Delete the old resume file from local storage, if it exists
   if (newTrainee.resume) {
     try {
       await fs.access(oldResumePath); // Check if file exists
       await fs.unlink(oldResumePath);
     } catch (err) {
       if (err.code !== 'ENOENT') {
         console.error('Error deleting old resume file:', err);
       }
     }
   }
 
   // Update the trainee's resume path in the database
   newTrainee.resume = uploadResume;
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
 
   // Check if the character certificate file is included in the request
   const charCertificateLocalPath = req.file?.path;
   if (!charCertificateLocalPath) {
     throw new ApiError(400, "Character certificate file is required");
   }
 
   // Find the trainee by ID
   const newTrainee = await NewTrainee.findById(id);
   if (!newTrainee) {
     throw new ApiError(404, "Trainee not found");
   }
 
   // Function to upload character certificate file to local storage
   const uploadCharCertificate = await uploadToLocal(req.file, 'charCertificate');
   if (!uploadCharCertificate) {
     throw new ApiError(500, "Failed to upload character certificate to local storage");
   }
 
   // Construct the path to the old character certificate file
   const oldCharCertificatePath = path.join(__dirname, '..', newTrainee.charCertificate);
 
   // Delete the old character certificate file from local storage, if it exists
   if (newTrainee.charCertificate) {
     try {
       await fs.access(oldCharCertificatePath); // Check if file exists
       await fs.unlink(oldCharCertificatePath);
     } catch (err) {
       if (err.code !== 'ENOENT') {
         console.error('Error deleting old character certificate file:', err);
       }
     }
   }
 
   // Update the trainee's character certificate path in the database
   newTrainee.charCertificate = uploadCharCertificate;
   const updatedTrainee = await newTrainee.save();
   if (!updatedTrainee) {
     throw new ApiError(500, "Failed to update trainee's character certificate");
   }
 
   // Send a successful response
   return res.status(200).json(
     new ApiResponse(200, updatedTrainee, "Character certificate updated successfully")
   );
 });

const getAllNewTrainee = asyncHandler(async (_, res) => {
  const newTrainees = await NewTrainee.find();
  if (!newTrainees || newTrainees.length === 0) {
    throw new ApiError(404, "No new trainees found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newTrainees,
        "List of all new Trainees"
      )
    );
});

const deleteNewTrainee = asyncHandler(async (req, res) => {
   const { id } = req.params;
 
   // Find the trainee by ID
   const newTrainee = await NewTrainee.findById(id);
   if (!newTrainee) {
     throw new ApiError(404, "Trainee not found");
   }
 
   // Function to delete files from local storage
   const deleteFiles = async () => {
     try {
       if (newTrainee.avatar) {
         const avatarPath = path.join(__dirname, '..', newTrainee.avatar);
         await fs.unlink(avatarPath);
       }
       if (newTrainee.charCertificate) {
         const charCertificatePath = path.join(__dirname, '..', newTrainee.charCertificate);
         await fs.unlink(charCertificatePath);
       }
       if (newTrainee.resume) {
         const resumePath = path.join(__dirname, '..', newTrainee.resume);
         await fs.unlink(resumePath);
       }
     } catch (err) {
       console.error('Error deleting files:', err);
     }
   };
 
   // Delete trainee from database
   const result = await NewTrainee.deleteOne({ _id: newTrainee._id });
 
   if (result.deletedCount === 0) {
     throw new ApiError(500, "Failed to delete trainee");
   }
 
   // Delete files from local storage
   await deleteFiles();
 
   return res.status(200).json(
     new ApiResponse(200, null, "Trainee deleted successfully")
   );
 });


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

const convertToCurrentTrainee = asyncHandler (async (req,res) => {
   const {
      cgpa,
      yearOfStudy,
      traineePeriod,
      mentor,
      department,
      topicOfPursue
   } = req.body

   const {id} = req.params
   const newTrainee = await NewTrainee.findById(id)

   if(!newTrainee){
      throw new ApiError(404,"new Trainee does not exist")
   }

   const currentTraineeData = {
      ...newTrainee.toObject(), // Copy all fields from newTrainee
      cgpa, // Additional fields specific to currentTrainee
      yearOfStudy,
      traineePeriod,
      mentor,
      department,
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

const countTraineesByCity = asyncHandler(async (_, res) => {
   try {
     const traineesByCity = await NewTrainee.aggregate([
       {
         $group: {
           _id: "$city",
           count: { $sum: 1 },
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           city: "$_id",
           count: 1,
           trainees: 1
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
         "Count of trainees by city and their full names"
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
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           institute: "$_id",
           count: 1,
           trainees: 1
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
         "Count of trainees by institute and their full names"
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
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           branch: "$_id",
           count: 1,
           trainees: 1
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
         "Count of trainees by branch and their full names"
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
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           timeOfJoin: "$_id",
           count: 1,
           trainees: 1
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
         "Count of trainees by time of join and their full names"
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
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           establishment: "$_id",
           count: 1,
           trainees: 1
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
         "Count of trainees by establishment and their full names"
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