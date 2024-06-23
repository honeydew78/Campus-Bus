import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Admin } from "../models/admin.models.js"
import { 
   uploadOnCloudinary,
   deleteFromCloudinary
  } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (adminId) => {
   try {
       const admin = await Admin.findById(adminId);
       if (!admin) {
           throw new ApiError(404, "Admin not found");
       }
       
       const accessToken = admin.generateAccessToken();
       const refreshToken = admin.generateRefreshToken();

       admin.refreshToken = refreshToken;
       await admin.save({ validateBeforeSave: false });

       console.log("Access Token:", accessToken);
       console.log("Refresh Token:", refreshToken);

       return { accessToken, refreshToken };
   } catch (error) {
       console.error("Error generating tokens:", error);
       throw new ApiError(500, "Something went wrong while generating refresh and access token");
   }
};

const loginAdmin = asyncHandler(async (req, res) => {
   const { email, username, password } = req.body;

   if (!username && !email) {
       throw new ApiError(400, "username or email is required");
   }

   const admin = await Admin.findOne({
       $or: [{ username }, { email }]
   });

   if (!admin) {
       throw new ApiError(404, "Admin does not exist");
   }

   const isPasswordValid = await admin.isPasswordCorrect(password);

   if (!isPasswordValid) {
       throw new ApiError(401, "Password is incorrect");
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

   const loggedinAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

   const options = {
       httpOnly: true,
       secure: true
   }; // cookies only modifiable from backend

   console.log("Logged in Admin:", loggedinAdmin);
   console.log("Access Token:", accessToken);
   console.log("Refresh Token:", refreshToken);

   return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(
           new ApiResponse(
               200,
               {
                   user: loggedinAdmin,
                   accessToken,
                   refreshToken
               },
               "Admin logged in successfully"
           )
       );
});

const registerAdmin = asyncHandler( async (req,res) => {
   const {fullName,email,username,password} = req.body
   console.log(req.body);

   // if(
   //    [fullName,email,username,password].some((field) => field?.trim() === "")
   // ){
   //    throw new ApiError(400,"All fields are required")
   // }

   const existedAdmin = await Admin.findOne({
      $or: [{username},{email}]
   }) 

   if(existedAdmin){
      throw new ApiError(409,"Admin with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar){
      throw new ApiError(400,"Avatar file is required (cloud)")
   }

   const admin = await Admin.create({
      fullName,
      avatar: avatar.url,
      email,
      password,
      username : username.toLowerCase()
   })

   const createdAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
   )

   if(!createdAdmin){
      throw new ApiError(500,"Something went wrong while registering the admin")
   }

   return res
   .status(201)
   .json(
      new ApiResponse(
      200,
      createdAdmin,
      "Admin registered successfully"
      )
   )
} )

const logoutAdmin = asyncHandler(async(req,res) => {
  await Admin.findByIdAndUpdate(
   req.admin._id,
   {
      $unset: {
      refreshToken: 1 // removes the field from document
      }
   },
   {
      new: true
   }
  )

  const options = {
   httpOnly : true,
   secure: true
   } // cookies only modifiable from backend
   console.log("logged out")

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"Admin logged Out"))

})

const refreshAccessToken = asyncHandler(async(req,res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401,"unauthorized request")
   }

   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      )
   
      const admin = await Admin.findById(decodedToken?._id)
   
      if(!admin){
         throw new ApiError(401,"Invalid Refresh Token")
      }
   
      if(incomingRefreshToken !== admin?.refreshToken){
         throw new ApiError(401,"Refresh token is expired or used")
      }
   
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(admin._id)
   
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json(
         new ApiResponse(
            200,
            {accessToken,refreshToken: newRefreshToken},
            "Access Token Refreshed"
         )
      )
   } catch (error) {
      throw new ApiError(401,error?.message || "Invalid refresh token")
   }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
   try {
     const { currentPassword, newPassword } = req.body;
     const adminId = req.admin.id; // Assuming you have middleware to get admin id from JWT
 
     // Fetch admin from database
     let admin = await Admin.findById(adminId);
     if (!admin) {
       throw new Error('Admin not found');
     }
 
     // Validate current password
     const isMatch = await bcrypt.compare(currentPassword, admin.password);
     if (!isMatch) {
       throw new Error('Current password is incorrect');
     }
 
     // Hash the new password before saving
     admin.password = newPassword
    await admin.save({validateBeforeSave: false})
 
     // Save updated admin object with new hashed password
   //   await admin.save();
 
     // Respond with success message
     return res.status(200).json({
       statusCode: 200,
       message: 'Password updated successfully'
     });
 
   } catch (error) {
     return res.status(400).json({
       statusCode: 400,
       message: error.message || 'Failed to update password'
     });
   }
 });
 

const getCurrentAdmin = asyncHandler(async(req,res) => {
   const admin = req.admin;
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

   return res
   .status(200)
   .json(new ApiResponse(
      200,
      admin,
      "current admin fetched succesfully"
   ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
   const { email, fullName } = req.body;
   const adminId = req.admin.id; // Assuming you have middleware that sets req.admin from JWT
 
   try {
     // Find admin by ID
     let admin = await Admin.findById(adminId);
 
     // Check if admin exists
     if (!admin) {
       throw new ApiError(404, "Admin not found");
     }
 
     // Update email if provided
     if (email) {
       admin.email = email;
     }
 
     // Update fullName if provided
     if (fullName) {
       admin.fullName = fullName;
     }
 
     // Save the updated admin object
     admin = await admin.save();
 
     // Log success or debug information
     console.log(`Admin with ID ${adminId} updated successfully:`, admin);
 
     // Respond with updated admin object
     return res.status(200).json({
       statusCode: 200,
       data: admin,
       message: "Account details updated successfully"
     });
   } catch (error) {
     // Log the error for debugging
     console.error('Error updating admin details:', error);
 
     // Handle errors
     return res.status(error.statusCode || 500).json({
       statusCode: error.statusCode || 500,
       message: error.message || "Failed to update account details"
     });
   }
 });
 

// const updateAdminAvatar = asyncHandler(async(req,res) => {
//    const avatarLocalPath = req.file?.path

//    if(!avatarLocalPath){
//       throw new ApiError(400,"Avatar file is missing")
//    }

//    const avatar = await uploadOnCloudinary(avatarLocalPath)

//    if(!avatar.url){
//       throw new ApiError(400,"Error while uploading on avatar")
//    }

//    const admin = await Admin.findByIdAndUpdate(
//       req.admin?._id,
//       {
//          $set:{
//             avatar: avatar.url
//          }
//       },
//       {new: true}
//    ).select("-password")

//    return res
//    .status(200)
//    .json(
//       new ApiResponse(200,admin,"Avatar image updated successfully")
//    )
// })

const updateAdminAvatar = asyncHandler(async (req, res) => {
   const avatarLocalPath = req.file?.path;
 
   if (!avatarLocalPath) {
     throw new ApiError(400, "Avatar file is missing");
   }
 
   const avatar = await uploadOnCloudinary(avatarLocalPath);
 
   if (!avatar.url) {
     throw new ApiError(400, "Error while uploading avatar");
   }
 
   const admin = await Admin.findById(req.admin?._id);
 
   if (!admin) {
     throw new ApiError(404, "Admin not found");
   }
 
   // Delete the previous avatar if it exists
   if (admin.avatar) {
     await deleteFromCloudinary(admin.avatar); // Assuming you have a function to delete files from Cloudinary
   }
 
   admin.avatar = avatar.url;
 
   await admin.save();
 
   const updatedAdmin = await Admin.findById(req.admin?._id).select("-password");
 
   return res
     .status(200)
     .json(new ApiResponse(200, updatedAdmin, "Avatar image updated successfully"));
 });
 

export { 
   registerAdmin,
   loginAdmin,
   logoutAdmin,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentAdmin,
   updateAccountDetails,
   updateAdminAvatar
   }