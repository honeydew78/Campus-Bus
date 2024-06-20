import { Router } from "express";
import {
   convertToCurrentTrainee,
   getAllCurrentTrainee,
   getCurrentTrainee,
   findCurrentTrainee,
   updateAccountDetails,
   deleteCurrentTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate,
   convertToPastTrainee,
   countTraineesByBranch,
   countTraineesByCity,
   countTraineesByEstablishment,
   countTraineesByInstitute,
   countTraineesByTimeOfJoin,
   countTraineesByDepartment,
   countTraineesByMentor
}  from "../controllers/currentTrainee.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

router.post('/register',convertToCurrentTrainee)
router.patch('/:id/update', updateAccountDetails); // Update trainee details
router.delete('/:id/delete', deleteCurrentTrainee); // Delete a trainee
router.post('/:id/convert-to-past',
   upload.fields([
   {
      name: "workReport",
      maxCount: 1
   },
]), convertToPastTrainee);
router.post('/find-current-trainee', findCurrentTrainee); // Get a trainee by appid or email
router.get('/:id', getCurrentTrainee); // Get a trainee by ID (GET method)
router.get('/',getAllCurrentTrainee) // Get all new trainees
router.post('/:id/update-avatar', upload.single('avatar'), updateAvatar);
router.post('/:id/update-resume', upload.single('resume'), updateResume);
router.post('/:id/update-char-cert', upload.single('charCertificate'), updateCharCertificate);

router.get('/stats/count-by-city', countTraineesByCity);
router.get('/stats/count-by-institute', countTraineesByInstitute);
router.get('/stats/count-by-branch', countTraineesByBranch);
router.get('/stats/count-by-season', countTraineesByTimeOfJoin);
router.get('/stats/count-by-establishment', countTraineesByEstablishment);
router.get('/stats/count-by-department', countTraineesByDepartment);
router.get('/stats/count-by-mentor', countTraineesByMentor);

export default router

