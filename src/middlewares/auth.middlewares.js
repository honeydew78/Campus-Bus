import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized request: Invalid token");
        }

        // Find admin by decoded token ID
        const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");
        
        if (!admin) {
            throw new ApiError(401, "Unauthorized request: Admin not found");
        }

        // Attach admin to request object
        req.admin = admin;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        throw new ApiError(401, error.message || "Invalid access token");
    }
});
