import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NewTrainee } from "../models/newTrainee.models.js";
import { CurrentTrainee } from "../models/currentTrainee.models.js";
import { PastTrainee } from "../models/pastTrainee.models.js";

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

const convertToCurrentTrainee = asyncHandler(async (req, res) => {
  const {
    applicationId,
    email,
    cgpa,
    yearOfStudy,
    traineePeriod,
    mentor,
    department, 
    topicOfPursue
  } = req.body;

  if (!applicationId && !email) {
    throw new ApiError(400, "application id or email is required");
  }

  const newTrainee = await NewTrainee.findOne({
    $or: [{ applicationId }, { email }]
  });

  if (!newTrainee) {
    throw new ApiError(404, "new Trainee does not exist");
  }

  const currentTraineeData = {
    ...newTrainee.toObject(), // Copy all fields from newTrainee
    cgpa, // Additional fields specific to currentTrainee
    yearOfStudy,
    traineePeriod,
    mentor,
    department, // Corrected spelling from departement to department
    topicOfPursue
  };

  if (!currentTraineeData) throw new ApiError(404, 'an error occurred while changing new to current');

  const currentTrainee = await CurrentTrainee.create(currentTraineeData);

  if (!currentTrainee) throw new ApiError(404, 'an error occurred while uploading current trainee');

  const deleteTrainee = await NewTrainee.findOneAndDelete(newTrainee);

  if (!deleteTrainee) throw new ApiError(500, "User could not be deleted");

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        currentTrainee,
        "current trainee registered and new one deleted"
      )
    );
});

const getAllCurrentTrainee = asyncHandler(async (_, res) => {
  const currentTrainees = await CurrentTrainee.find();
  if (!currentTrainees) throw new ApiError(404, "no new trainees found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        currentTrainees,
        "List of all new Trainees"
      )
    );
});

const getCurrentTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const currentTrainee = await CurrentTrainee.findById(id).lean();
  if (!currentTrainee) throw new ApiError(404, "Trainee does not exist");

  console.log(currentTrainee);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        currentTrainee,
        "current trainee received successfully"
      )
    );
});

const findCurrentTrainee = asyncHandler(async (req, res) => {
   const { email, applicationId } = req.body;
 
   if (!email && !applicationId) {
     throw new ApiError(400, "Email or Application ID is required");
   }
 
   let currentTrainee;
   if (email) {
      currentTrainee = await CurrentTrainee.findOne({ email }).lean();
   } else if (applicationId) {
      currentTrainee = await CurrentTrainee.findOne({ applicationId }).lean();
   }
 
   if (!currentTrainee) throw new ApiError(404, "Trainee does not exist");
 
   console.log(currentTrainee);
 
   return res.status(200).json(
     new ApiResponse(
       200,
       currentTrainee,
       "Current trainee got successfully"
     )
   );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
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
    department, // Corrected spelling from departement to department
    topicOfPursue
  } = req.body;

  const currentTrainee = await CurrentTrainee.findById(id);
  if (!currentTrainee) throw new ApiError(404, "Current Trainee does not exist");

  if (fullName) currentTrainee.fullName = fullName;
  if (fatherName) currentTrainee.fatherName = fatherName;
  if (dob) currentTrainee.dob = dob;
  if (aadhar) currentTrainee.aadhar = aadhar;
  if (email) currentTrainee.email = email;
  if (phone) currentTrainee.phone = phone;
  if (address) currentTrainee.address = address;
  if (city) currentTrainee.city = city;
  if (institute) currentTrainee.institute = institute;
  if (branch) currentTrainee.branch = branch;
  if (establishment) currentTrainee.establishment = establishment;
  if (timeOfJoin) currentTrainee.timeOfJoin = timeOfJoin;
  if (cgpa) currentTrainee.cgpa = cgpa;
  if (yearOfStudy) currentTrainee.yearOfStudy = yearOfStudy;
  if (traineePeriod) currentTrainee.traineePeriod = traineePeriod;
  if (mentor) currentTrainee.mentor = mentor;
  if (department) currentTrainee.department = department; // Corrected spelling from departement to department
  if (topicOfPursue) currentTrainee.topicOfPursue = topicOfPursue;

  const updatedCurrentTrainee = await currentTrainee.save();
  if (!updatedCurrentTrainee) throw new ApiError(500, "Something went wrong while updating");

  console.log(updatedCurrentTrainee);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCurrentTrainee,
        "Details Updated"
      )
    );
});

const deleteCurrentTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the trainee by ID
  const currentTrainee = await CurrentTrainee.findById(id);
  if (!currentTrainee) {
    throw new ApiError(404, "Trainee not found");
  }

  // Function to delete files from local storage
  const deleteFiles = async () => {
    try {
      if (currentTrainee.avatar) {
        const avatarPath = path.join(__dirname, '..', currentTrainee.avatar);
        await fs.unlink(avatarPath);
      }
      if (currentTrainee.charCertificate) {
        const charCertificatePath = path.join(__dirname, '..', currentTrainee.charCertificate);
        await fs.unlink(charCertificatePath);
      }
      if (currentTrainee.resume) {
        const resumePath = path.join(__dirname, '..', currentTrainee.resume);
        await fs.unlink(resumePath);
      }
    } catch (err) {
      console.error('Error deleting files:', err);
    }
  };

  // Delete trainee from database
  const result = await CurrentTrainee.deleteOne({ _id: currentTrainee._id });

  if (result.deletedCount === 0) {
    throw new ApiError(500, "Failed to delete trainee");
  }

  // Delete files from local storage
  await deleteFiles();

  return res.status(200).json(
    new ApiResponse(200, null, "Trainee deleted successfully")
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
  const currentTrainee = await CurrentTrainee.findById(id);
  if (!currentTrainee) {
    throw new ApiError(404, "Trainee not found");
  }

  // Function to upload avatar file to local storage
  const uploadAvatar = await uploadToLocal(req.file, 'avatar');
  if (!uploadAvatar) {
    throw new ApiError(500, "Failed to upload avatar to local storage");
  }

  // Construct the path to the old avatar file
  const oldAvatarPath = path.join(__dirname, '..', currentTrainee.avatar);

  // Delete the old avatar file from local storage, if it exists
  if (currentTrainee.avatar) {
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
  currentTrainee.avatar = uploadAvatar;
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

  // Function to upload resume file to local storage
  const uploadResume = await uploadToLocal(req.file, 'resume');
  if (!uploadResume) {
    throw new ApiError(500, "Failed to upload resume to local storage");
  }

  // Construct the path to the old resume file
  const oldResumePath = path.join(__dirname, '..', currentTrainee.resume);

  // Delete the old resume file from local storage, if it exists
  if (currentTrainee.resume) {
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
  currentTrainee.resume = uploadResume;
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

  // Check if the character certificate file is included in the request
  const charCertificateLocalPath = req.file?.path;
  if (!charCertificateLocalPath) {
    throw new ApiError(400, "Character certificate file is required");
  }

  // Find the trainee by ID
  const currentTrainee = await CurrentTrainee.findById(id);
  if (!currentTrainee) {
    throw new ApiError(404, "Trainee not found");
  }

  // Function to upload character certificate file to local storage
  const uploadCharCertificate = await uploadToLocal(req.file, 'charCertificate');
  if (!uploadCharCertificate) {
    throw new ApiError(500, "Failed to upload character certificate to local storage");
  }

  // Construct the path to the old character certificate file
  const oldCharCertificatePath = path.join(__dirname, '..', currentTrainee.charCertificate);

  // Delete the old character certificate file from local storage, if it exists
  if (currentTrainee.charCertificate) {
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
  currentTrainee.charCertificate = uploadCharCertificate;
  const updatedTrainee = await currentTrainee.save();
  if (!updatedTrainee) {
    throw new ApiError(500, "Failed to update trainee's character certificate");
  }

  // Send a successful response
  return res.status(200).json(
    new ApiResponse(200, updatedTrainee, "Character certificate updated successfully")
  );
});

// const convertToPastTrainee = asyncHandler(async (req, res) => {
//   console.log(req.files); // Debugging statement
//   const { endDate } = req.body;
//   const { id } = req.params;
//   const currentTrainee = await CurrentTrainee.findById(id);
//   if (!currentTrainee) {
//     throw new ApiError(404, "current Trainee does not exist");
//   }

//   const workReportLocalPath = req.files?.workReport[0]?.path;

//   if (!workReportLocalPath) {
//     throw new ApiError(400, "Work Report file is required");
//   }

//   const workReport = await uploadOnCloudinary(workReportLocalPath);

//   if (!workReport) {
//     throw new ApiError(400, "workReport file failed to upload on cloudinary");
//   }

//   const pastTraineeData = {
//     ...currentTrainee.toObject(), // Copy all fields from currentTrainee
//     endDate,
//     workReport: workReport.url
//   };

//   delete pastTraineeData.traineePeriod;

//   if (!pastTraineeData) throw new ApiError(404, 'an error occurred while changing current to past');

//   const pastTrainee = await PastTrainee.create(pastTraineeData);

//   if (!pastTrainee) {
//     throw new ApiError(500, "Failed to create past trainee");
//   }

//   const deleteTrainee = await CurrentTrainee.findByIdAndDelete(id);

//   if (!deleteTrainee) throw new ApiError(500, "User could not be deleted");

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         pastTrainee,
//         "Converted to past trainee successfully"
//       )
//     );
// });

const convertToPastTrainee = asyncHandler(async (req, res) => {
  const { endDate } = req.body;
  const { id } = req.params;

  // Find current trainee by ID
  const currentTrainee = await CurrentTrainee.findById(id);
  if (!currentTrainee) {
    throw new ApiError(404, "Current trainee does not exist");
  }

  // Get work report file path from request
  const workReportLocalPath = req.files?.workReport[0]?.path;

  // Ensure work report file path is available
  if (!workReportLocalPath) {
    throw new ApiError(400, "Work Report file is required");
  }

  // Function to upload work report file to local storage
  const uploadWorkReport = await uploadToLocal(req.files.workReport[0], 'workReport');
  if (!uploadWorkReport) {
    throw new ApiError(500, "Failed to upload work report to local storage");
  }

  // Prepare data for past trainee
  const pastTraineeData = {
    ...currentTrainee.toObject(), // Copy all fields from currentTrainee
    endDate,
    workReport: uploadWorkReport
  };

  delete pastTraineeData.traineePeriod;

  // Create past trainee record
  const pastTrainee = await PastTrainee.create(pastTraineeData);
  if (!pastTrainee) {
    throw new ApiError(500, "Failed to create past trainee");
  }

  // Delete current trainee record
  const deleteTrainee = await CurrentTrainee.findByIdAndDelete(id);
  if (!deleteTrainee) {
    throw new ApiError(500, "Failed to delete current trainee");
  }

  // Send a successful response
  return res.status(201).json(
    new ApiResponse(
      201,
      pastTrainee,
      "Converted to past trainee successfully"
    )
  );
});

const countTraineesByCity = asyncHandler(async (_, res) => {
   try {
     const traineesByCity = await CurrentTrainee.aggregate([
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
     const traineesByInstitute = await CurrentTrainee.aggregate([
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
     const traineesByBranch = await CurrentTrainee.aggregate([
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
     const traineesByTimeOfJoin = await CurrentTrainee.aggregate([
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
     const traineesByEstablishment = await CurrentTrainee.aggregate([
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

const countTraineesByDepartment = asyncHandler(async (_, res) => {
   try {
     const traineesByDepartment = await CurrentTrainee.aggregate([
       {
         $group: {
           _id: "$department",
           count: { $sum: 1 },
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           department: "$_id",
           count: 1,
           trainees: 1
         }
       }
     ]);
 
     if (!traineesByDepartment || traineesByDepartment.length === 0) {
       throw new ApiError(404, "No trainees found");
     }
 
     return res.status(200).json(
       new ApiResponse(
         200,
         traineesByDepartment,
         "Count of trainees by department and their full names"
       )
     );
   } catch (error) {
     throw new ApiError(500, error.message);
   }
});

const countTraineesByMentor = asyncHandler(async (_, res) => {
   try {
     const traineesByMentor = await CurrentTrainee.aggregate([
       {
         $group: {
           _id: "$mentor",
           count: { $sum: 1 },
           trainees: { $push: { id: "$_id", fullName: "$fullName" } } // Collecting trainee IDs and full names in an array
         }
       },
       {
         $project: {
           _id: 0,
           mentor: "$_id",
           count: 1,
           trainees: 1
         }
       }
     ]);
 
     if (!traineesByMentor || traineesByMentor.length === 0) {
       throw new ApiError(404, "No trainees found");
     }
 
     return res.status(200).json(
       new ApiResponse(
         200,
         traineesByMentor,
         "Count of trainees by department and their full names"
       )
     );
   } catch (error) {
     throw new ApiError(500, error.message);
   }
});

export {
  convertToCurrentTrainee,
  getAllCurrentTrainee,
  getCurrentTrainee,
  findCurrentTrainee,
  updateAccountDetails,
  deleteCurrentTrainee,
  updateAvatar,
  updateResume,
  updateCharCertificate,
  convertToPastTrainee,
  countTraineesByBranch,
  countTraineesByCity,
  countTraineesByEstablishment,
  countTraineesByInstitute,
  countTraineesByTimeOfJoin,
  countTraineesByDepartment,
  countTraineesByMentor
};
