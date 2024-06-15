import { Router } from "express";
import { 
   registerNewTrainee,
   getAllNewTrainee,
   getNewTrainee,
   updateAccountDetails,
   deleteNewTrainee,
   convertToCurrentTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate
   } from "../controllers/newTrainee.controllers.js";
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
router.post('/:id/update', updateAccountDetails); // Update trainee details
router.post('/:id/delete', deleteNewTrainee); // Delete a trainee
router.post('/:id/convert-to-current',convertToCurrentTrainee)
router.get('/:id', getNewTrainee); // Get a trainee by ID (GET method)
router.get('/',getAllNewTrainee) // Get all new trainees
router.put('/:id/update-avatar', upload.single('avatar'), updateAvatar);
router.put('/:id/update-resume', upload.single('resume'), updateResume);
router.put('/:id/update-char-cert', upload.single('charCertificate'), updateCharCertificate);

export default router