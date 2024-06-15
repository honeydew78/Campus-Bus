import { Router } from "express";
import {
   convertToCurrentTrainee,
   getAllCurrentTrainee,
   getCurrentTrainee,
   updateAccountDetails,
   deleteCurrentTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate
}  from "../controllers/currentTrainee.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

router.post('/register',convertToCurrentTrainee)
router.post('/:id/update', updateAccountDetails); // Update trainee details
router.post('/:id/delete', deleteCurrentTrainee); // Delete a trainee
router.post('/:id/convert-to-current',convertToCurrentTrainee)
router.get('/:id', getCurrentTrainee); // Get a trainee by ID (GET method)
router.get('/',getAllCurrentTrainee) // Get all new trainees
router.put('/:id/update-avatar', upload.single('avatar'), updateAvatar);
router.put('/:id/update-resume', upload.single('resume'), updateResume);
router.put('/:id/update-char-cert', upload.single('charCertificate'), updateCharCertificate);

export default router

