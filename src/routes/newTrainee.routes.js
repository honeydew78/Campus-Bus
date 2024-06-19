import { Router } from "express";
import { 
   registerNewTrainee,
   getAllNewTrainee,
   findNewTrainee,
   getNewTrainee,
   updateAccountDetails,
   deleteNewTrainee,
   convertToCurrentTrainee,
   updateAvatar,
   updateResume,
   updateCharCertificate,
   countTraineesByCity,
   countTraineesByInstitute,
   countTraineesByBranch,
   countTraineesByTimeOfJoin,
   countTraineesByEstablishment
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
router.patch('/:id/update', updateAccountDetails); // Update trainee details
router.delete('/:id/delete', deleteNewTrainee); // Delete a trainee
router.post('/:id/convert-to-current',convertToCurrentTrainee)
router.post('/find-new-trainee', findNewTrainee); // Get a trainee by appid or email
router.get('/',getAllNewTrainee) // Get all new trainees
router.get('/:id', getNewTrainee); // Get a trainee by ID (GET method)
router.post('/:id/update-avatar', upload.single('avatar'), updateAvatar);
router.post('/:id/update-resume', upload.single('resume'), updateResume);
router.post('/:id/update-char-cert', upload.single('charCertificate'), updateCharCertificate);


router.get('/stats/count-by-city', countTraineesByCity);
router.get('/stats/count-by-institute', countTraineesByInstitute);
router.get('/stats/count-by-branch', countTraineesByBranch);
router.get('/stats/count-by-season', countTraineesByTimeOfJoin);
router.get('/stats/count-by-establishment', countTraineesByEstablishment);

export default router