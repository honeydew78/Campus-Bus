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
router.route("/login").post(loginAdmin)


router.route("/logout").post(verifyJWT,logoutAdmin)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-password").patch(verifyJWT,changeCurrentPassword)
router.route("/current-admin").get(verifyJWT,getCurrentAdmin)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)


router.route("/avatar").post(verifyJWT,upload.single('avatar'),updateAdminAvatar)


export default router