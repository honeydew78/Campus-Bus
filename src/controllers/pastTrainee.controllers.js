import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PastTrainee } from "../models/pastTrainee.models.js";
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

const convertToPastTrainee = asyncHandler(async (req, res) => {
  const {
    applicationId,
    email,
    endDate
  } = req.body;

  if (!applicationId && !email) {
    throw new ApiError(400, "Application ID or email is required");
  }

  const currentTrainee = await CurrentTrainee.findOne({
    $or: [{ applicationId }, { email }]
  });

  if (!currentTrainee) {
    throw new ApiError(404, "Current trainee does not exist");
  }

  const workReportLocalPath = req.files?.workReport[0]?.path;

  if (!workReportLocalPath) {
    throw new ApiError(400, "Work Report file is required");
  }

  // Function to upload work report file to local storage
  const uploadWorkReport = await uploadToLocal(workReportLocalPath, 'workReport');
  if (!uploadWorkReport) {
    throw new ApiError(500, "Failed to upload work report to local storage");
  }

  const pastTraineeData = {
    ...currentTrainee.toObject(), // Copy all fields from currentTrainee
    endDate,
    workReport: uploadWorkReport // Store the local path or filename in the database
  };

  delete pastTraineeData.traineePeriod;

  // Create past trainee record
  const pastTrainee = await PastTrainee.create(pastTraineeData);
  if (!pastTrainee) {
    throw new ApiError(500, "Failed to create past trainee");
  }

  // Delete current trainee record
  const deleteTrainee = await CurrentTrainee.findOneAndDelete({ _id: currentTrainee._id });
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

const getAllPastTrainee = asyncHandler(async (_, res) => {
    const pastTrainees = await PastTrainee.find()
    if (!pastTrainees) throw new ApiError(404, "no past trainees found")

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

const getPastTrainee = asyncHandler(async (req, res) => {
    const { id } = req.params

    const pastTrainee = await PastTrainee.findById(id).lean();
    if (!pastTrainee) throw new ApiError(404, "Trainee does not exist")
    console.log(pastTrainee)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                pastTrainee,
                "past trainee received successfully"
            )
        )
})

const findPastTrainee = asyncHandler(async (req, res) => {
    const { email, applicationId } = req.body;
  
    if (!email && !applicationId) {
      throw new ApiError(400, "Email or Application ID is required");
    }
  
    let pastTrainee;
    if (email) {
        pastTrainee = await PastTrainee.findOne({ email }).lean();
    } else if (applicationId) {
        pastTrainee = await PastTrainee.findOne({ applicationId }).lean();
    }
  
    if (!pastTrainee) throw new ApiError(404, "Trainee does not exist");
  
    console.log(pastTrainee);
  
    return res.status(200).json(
      new ApiResponse(
        200,
        pastTrainee,
        "Past trainee got successfully"
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
        mentor,
        department,
        topicOfPursue,
        endDate
    } = req.body

    const pastTrainee = await PastTrainee.findById(id)
    if (!pastTrainee) throw new ApiError(404, "Past Trainee does not exist")

    let updatedPastTrainee = pastTrainee
    if (fullName) pastTrainee.fullName = fullName;
    if (fatherName) pastTrainee.fatherName = fatherName;
    if (dob) pastTrainee.dob = dob;
    if (aadhar) pastTrainee.aadhar = aadhar;
    if (email) pastTrainee.email = email;
    if (phone) pastTrainee.phone = phone;
    if (address) pastTrainee.address = address;
    if (city) pastTrainee.city = city;
    if (institute) pastTrainee.institute = institute;
    if (branch) pastTrainee.branch = branch;
    if (establishment) pastTrainee.establishment = establishment;
    if (timeOfJoin) pastTrainee.timeOfJoin = timeOfJoin;
    if (cgpa) pastTrainee.cgpa = cgpa;
    if (yearOfStudy) pastTrainee.yearOfStudy = yearOfStudy;
    if (endDate) pastTrainee.endDate = endDate;
    if (mentor) pastTrainee.mentor = mentor;
    if (department) pastTrainee.department = department;
    if (topicOfPursue) pastTrainee.topicOfPursue = topicOfPursue;

    updatedPastTrainee = await pastTrainee.save();
    if (!updatedPastTrainee) throw new ApiError(500, "Something went wrong while updating")
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

const deletePastTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the past trainee by ID
  const pastTrainee = await PastTrainee.findById(id);
  if (!pastTrainee) {
    throw new ApiError(404, "Past trainee not found");
  }

  // Function to delete files from local storage
  const deleteFiles = async () => {
    try {
      if (pastTrainee.avatar) {
        const avatarPath = path.join(__dirname, '..', pastTrainee.avatar);
        await fs.unlink(avatarPath);
      }
      if (pastTrainee.charCertificate) {
        const charCertificatePath = path.join(__dirname, '..', pastTrainee.charCertificate);
        await fs.unlink(charCertificatePath);
      }
      if (pastTrainee.resume) {
        const resumePath = path.join(__dirname, '..', pastTrainee.resume);
        await fs.unlink(resumePath);
      }
      if (pastTrainee.workReport) {
        const workReportPath = path.join(__dirname, '..', pastTrainee.workReport);
        await fs.unlink(workReportPath);
      }
    } catch (err) {
      console.error('Error deleting files:', err);
    }
  };

  // Delete past trainee from database
  const result = await PastTrainee.deleteOne({ _id: pastTrainee._id });

  if (result.deletedCount === 0) {
    throw new ApiError(500, "Failed to delete past trainee");
  }

  // Delete files from local storage
  await deleteFiles();

  return res.status(200).json(
    new ApiResponse(200, null, "Past trainee deleted successfully")
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
  const pastTrainee = await PastTrainee.findById(id);
  if (!pastTrainee) {
    throw new ApiError(404, "Past trainee not found");
  }

  // Function to upload avatar file to local storage
  const uploadAvatar = await uploadToLocal(req.file, 'avatar');
  if (!uploadAvatar) {
    throw new ApiError(500, "Failed to upload avatar to local storage");
  }

  // Construct the path to the old avatar file
  const oldAvatarPath = path.join(__dirname, '..', pastTrainee.avatar);

  // Delete the old avatar file from local storage, if it exists
  if (pastTrainee.avatar) {
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
  pastTrainee.avatar = uploadAvatar;
  const updatedTrainee = await pastTrainee.save();
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

  // Find the past trainee by ID
  const pastTrainee = await PastTrainee.findById(id);
  if (!pastTrainee) {
    throw new ApiError(404, "Past trainee not found");
  }

  // Function to upload resume file to local storage
  const uploadResume = await uploadToLocal(req.file, 'resume');
  if (!uploadResume) {
    throw new ApiError(500, "Failed to upload resume to local storage");
  }

  // Construct the path to the old resume file
  const oldResumePath = path.join(__dirname, '..', pastTrainee.resume);

  // Delete the old resume file from local storage, if it exists
  if (pastTrainee.resume) {
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
  pastTrainee.resume = uploadResume;
  const updatedTrainee = await pastTrainee.save();
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
    throw new ApiError(400, "Character Certificate file is required");
  }

  // Find the past trainee by ID
  const pastTrainee = await PastTrainee.findById(id);
  if (!pastTrainee) {
    throw new ApiError(404, "Past trainee not found");
  }

  // Function to upload charCertificate file to local storage
  const uploadCharCertificate = await uploadToLocal(req.file, 'charCertificate');
  if (!uploadCharCertificate) {
    throw new ApiError(500, "Failed to upload character certificate to local storage");
  }

  // Construct the path to the old charCertificate file
  const oldCharCertificatePath = path.join(__dirname, '..', pastTrainee.charCertificate);

  // Delete the old charCertificate file from local storage, if it exists
  if (pastTrainee.charCertificate) {
    try {
      await fs.access(oldCharCertificatePath); // Check if file exists
      await fs.unlink(oldCharCertificatePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error deleting old character certificate file:', err);
      }
    }
  }

  // Update the trainee's charCertificate path in the database
  pastTrainee.charCertificate = uploadCharCertificate;
  const updatedTrainee = await pastTrainee.save();
  if (!updatedTrainee) {
    throw new ApiError(500, "Failed to update trainee's character certificate");
  }

  // Send a successful response
  return res.status(200).json(
    new ApiResponse(200, updatedTrainee, "Character Certificate updated successfully")
  );
});

const updateWorkReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the workReport file is included in the request
  const workReportLocalPath = req.file?.path;
  if (!workReportLocalPath) {
    throw new ApiError(400, "Work Report file is required");
  }

  // Find the past trainee by ID
  const pastTrainee = await PastTrainee.findById(id);
  if (!pastTrainee) {
    throw new ApiError(404, "Past trainee not found");
  }

  // Function to upload workReport file to local storage
  const uploadWorkReport = await uploadToLocal(req.file, 'workReport');
  if (!uploadWorkReport) {
    throw new ApiError(500, "Failed to upload work report to local storage");
  }

  // Construct the path to the old workReport file
  const oldWorkReportPath = path.join(__dirname, '..', pastTrainee.workReport);

  // Delete the old workReport file from local storage, if it exists
  if (pastTrainee.workReport) {
    try {
      await fs.access(oldWorkReportPath); // Check if file exists
      await fs.unlink(oldWorkReportPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error deleting old work report file:', err);
      }
    }
  }

  // Update the trainee's workReport path in the database
  pastTrainee.workReport = uploadWorkReport;
  const updatedTrainee = await pastTrainee.save();
  if (!updatedTrainee) {
    throw new ApiError(500, "Failed to update trainee's work report");
  }

  // Send a successful response
  return res.status(200).json(
    new ApiResponse(200, updatedTrainee, "Work Report updated successfully")
  );
});

const countTraineesByCity = asyncHandler(async (_, res) => {
    try {
      const traineesByCity = await PastTrainee.aggregate([
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
      const traineesByInstitute = await PastTrainee.aggregate([
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
      const traineesByBranch = await PastTrainee.aggregate([
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
      const traineesByTimeOfJoin = await PastTrainee.aggregate([
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
      const traineesByEstablishment = await PastTrainee.aggregate([
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
      const traineesByDepartment = await PastTrainee.aggregate([
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
      const traineesByMentor = await PastTrainee.aggregate([
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
    convertToPastTrainee,
    getAllPastTrainee,
    getPastTrainee,
    findPastTrainee,
    updateAccountDetails,
    deletePastTrainee,
    updateAvatar,
    updateResume,
    updateCharCertificate,
    updateWorkReport,
    countTraineesByBranch,
    countTraineesByCity,
    countTraineesByDepartment,
    countTraineesByEstablishment,
    countTraineesByInstitute,
    countTraineesByMentor,
    countTraineesByTimeOfJoin
}
