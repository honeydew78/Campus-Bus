import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Admin } from "../models/admin.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(adminId) => {
   try {
      const admin = await Admin.findById(adminId)
      const accessToken = admin.generateAccessToken()
      const refreshToken = admin.generateRefreshToken()

      admin.refreshToken = refreshToken
      await admin.save({validateBeforeSave: false})

      return {accessToken,refreshToken}
   } catch (error) {
      throw new ApiError(500,"Something went wrong while generating refresh and access token")
   }
}

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

const loginAdmin = asyncHandler ( async(req,res) => {
   const {email,username,password} = req.body
   // console.log(email)

   if(!username && !email){
      throw new ApiError(400,"username or email is required")
   }

   const admin = await Admin.findOne({
      $or: [{username},{email}]
   })

   if(!admin){
      throw new ApiError(404,"Admin does not exist")

   }

   const isPsswordValid = await admin.isPasswordCorrect(password)

   if(!isPsswordValid){
      throw new ApiError(401,"Password is incorrect")
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(admin._id)

   const loggedinAdmin = await Admin.findById(admin._id).
   select("-password -refreshToken")

   const options = {
      httpOnly : true,
      secure: true
   } // cookies only modifiable from backend

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedinAdmin,accessToken,refreshToken
         },
         "Admin logged in successfully"
      )
   )
                  
})

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

const changeCurrentPassword = asyncHandler(async(req,res) => {
   const {oldPassword,newPassword} = req.body

   const admin = await Admin.findById(req.admin?._id)
   const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
      throw new ApiError(400,"Invalid old password")
   }

   admin.password = newPassword
   await admin.save({validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentAdmin = asyncHandler(async(req,res) => {
   return res
   .status(200)
   .json(new ApiResponse(
      200,
      req.admin,
      "current admin fetched succesfully"
   ))
})

const updateAccountDetails = asyncHandler(async(req,res) => {
   const {fullName,email} = req.body
   if(!fullName || !email){
      throw new ApiError(400,"All fields are required")
   }

   const admin = await Admin.findByIdAndUpdate(
     req.admin?._id,
     {
       $set: {
         fullName,
         email: email
       }
     },
     {new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(
      200,
      admin,
      "Account details updated successfully"
   ))
})

const updateAdminAvatar = asyncHandler(async(req,res) => {
   const avatarLocalPath = req.file?.path

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url){
      throw new ApiError(400,"Error while uploading on avatar")
   }

   const admin = await Admin.findByIdAndUpdate(
      req.admin?._id,
      {
         $set:{
            avatar: avatar.url
         }
      },
      {new: true}
   ).select("-password")

   return res
   .status(200)
   .json(
      new ApiResponse(200,admin,"Avatar image updated successfully")
   )
})

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