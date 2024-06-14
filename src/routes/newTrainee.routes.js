import { Router } from "express";
import { registerNewTrainee,updateAccountDetails ,changeDummy} from "../controllers/newTrainee.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

router.route("/register").post(
   upload.fields([
      {
         name: "avatar",
         maxCount: 1
      },
      {
         name: "charCertificate",
         maxCount: 1
      },
      {
         name: "resume",
         maxCount: 1
      },
   ]),
   registerNewTrainee
)
router.route("/update-account").post(updateAccountDetails)
router.route("/changedummy").post(changeDummy)


export default router