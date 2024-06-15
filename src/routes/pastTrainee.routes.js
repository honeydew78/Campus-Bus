import { Router } from "express";
import {
   convertToPastTrainee,
   getAllPastTrainee,
   getPastTrainee,
   updateAccountDetails,
   deletePastTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate,
   updateWorkReport
}  from "../controllers/pastTrainee.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

router.post('/register',
   upload.fields([
      {
         name: "workReport",
         maxCount: 1
      },
   ]),
   convertToPastTrainee)
router.post('/:id/update', updateAccountDetails); // Update trainee details
router.post('/:id/delete', deletePastTrainee); // Delete a trainee
router.get('/:id', getPastTrainee); // Get a trainee by ID (GET method)
router.get('/',getAllPastTrainee) // Get all new trainees
router.put('/:id/update-avatar', upload.single('avatar'), updateAvatar);
router.put('/:id/update-resume', upload.single('resume'), updateResume);
router.put('/:id/update-char-cert', upload.single('charCertificate'), updateCharCertificate);
router.put('/:id/update-work-repo', upload.single('workReport'), updateWorkReport);

export default router

