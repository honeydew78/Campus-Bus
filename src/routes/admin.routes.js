import { Router } from "express";
import { 
   registerAdmin, 
   loginAdmin,
   logoutAdmin,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentAdmin,
   updateAccountDetails,
   updateAdminAvatar
   } from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router()

router.route("/register").post(
   upload.fields([
      {
         name: "avatar",
         maxCount: 1
      }
   ]),
   registerAdmin
)
// router.route("/register").post(upload.single('avatar'),registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyJWT,logoutAdmin)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changepassword").post(changeCurrentPassword)
router.route("/currentadmin").post(getCurrentAdmin)
router.route("/updateaccount").post(updateAccountDetails)
router.route("/updateavatar").post(upload.single('avatar'),updateAdminAvatar)


export default router