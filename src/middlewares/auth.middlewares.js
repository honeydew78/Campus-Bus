import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.models.js";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
   try {
      const token = req.cookies?.accessToken || req.header
      ("Authorization")?.replace("Bearer ","")
   
      if(!token){
         throw new ApiError(401,"Unauthorized request")
      }
   
      const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      const admin = await Admin.findById(decodeToken?._id).select("-password -refreshToken")
   
      if(!admin){
         throw new ApiError(401,"Invalid Access Token")
      }
   
      req.admin = admin;
      next()
   } catch (error) {
      throw new ApiError(401,error?.message || "Invalid access token")
   }
})