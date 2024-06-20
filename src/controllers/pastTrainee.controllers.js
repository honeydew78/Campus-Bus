import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PastTrainee } from "../models/pastTrainee.models.js";
import { CurrentTrainee } from "../models/currentTrainee.models.js";

const convertToPastTrainee = asyncHandler(async (req, res) => {
    const {
        applicationId,
        email,
        endDate
    } = req.body

    if (!applicationId && !email) {
        throw new ApiError(400, "application id or email is required")
    }

    const currentTrainee = await CurrentTrainee.findOne({
        $or: [{ applicationId }, { email }]
    })

    if (!currentTrainee) {
        throw new ApiError(404, "current Trainee does not exist")
    }

    const workReportLocalPath = req.files?.workReport[0]?.path;

   if(!workReportLocalPath){
      throw new ApiError(400,"Avatar file is required")
   }

   const workReport = await uploadOnCloudinary(workReportLocalPath)

   if(!workReport){
      throw new ApiError(400,"workReport file failed to upload on cloudinary")
   }

    const pastTraineeData = {
        ...currentTrainee.toObject(), // Copy all fields from newTrainee
        endDate,
        workReport: workReport.url
    }

    delete pastTraineeData.traineePeriod

    if (!pastTraineeData) throw new ApiError(404, 'an error occurred while changing new to current')

    const pastTrainee = await PastTrainee.create(pastTraineeData);

    if (!pastTrainee) {
        throw new ApiError(500, "Failed to create past trainee");
    }

    const deleteTrainee = await CurrentTrainee.findOneAndDelete(currentTrainee);

    if (!deleteTrainee) throw new ApiError(500, "User could not be deleted")

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                pastTrainee,
                "Converted to past trainee successfully")
        );
})

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

const deletePastTrainee = asyncHandler ( async(req,res) => {
    const {id} = req.params
    const pastTrainee = await PastTrainee.findById(id)
    if(!pastTrainee) throw new ApiError(404,"Trainee does not exist")
 
    // await newTrainee.delete()
    const result = await PastTrainee.deleteOne({ _id: pastTrainee._id });
 
   if (result.deletedCount === 0) {
     throw new ApiError(500, "Failed to delete trainee");
   }
    
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
