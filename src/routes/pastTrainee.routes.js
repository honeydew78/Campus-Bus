import { Router } from "express";
import {
   convertToPastTrainee,
   getAllPastTrainee,
   getPastTrainee,
   findPastTrainee,
   updateAccountDetails,
   deletePastTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate,
   updateWorkReport,
   countTraineesByBranch,
   countTraineesByCity,
   countTraineesByDepartment,
   countTraineesByEstablishment,
   countTraineesByInstitute,
   countTraineesByMentor,
   countTraineesByTimeOfJoin
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
router.patch('/:id/update', updateAccountDetails); // Update trainee details
router.delete('/:id/delete', deletePastTrainee); // Delete a trainee
router.get('/:id', getPastTrainee); // Get a trainee by ID (GET method)
router.post('/find-past-trainee', findPastTrainee); // Get a trainee by appid or email
router.get('/',getAllPastTrainee) // Get all new trainees
router.post('/:id/update-avatar', upload.single('avatar'), updateAvatar);
router.post('/:id/update-resume', upload.single('resume'), updateResume);
router.post('/:id/update-char-cert', upload.single('charCertificate'), updateCharCertificate);
router.post('/:id/update-work-repo', upload.single('workReport'), updateWorkReport);

router.get('/stats/count-by-city', countTraineesByCity);
router.get('/stats/count-by-institute', countTraineesByInstitute);
router.get('/stats/count-by-branch', countTraineesByBranch);
router.get('/stats/count-by-season', countTraineesByTimeOfJoin);
router.get('/stats/count-by-establishment', countTraineesByEstablishment);
router.get('/stats/count-by-department', countTraineesByDepartment);
router.get('/stats/count-by-mentor', countTraineesByMentor);

export default router

