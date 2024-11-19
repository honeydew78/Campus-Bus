import { Router } from 'express';
import { recaptchaMiddleware1 } from '../middlewares/recaptchaForReg.middlewares.js';
import { recaptchaMiddleware2 } from '../middlewares/recaptchaForLog.middlewares.js';
import { 
   registerAdmin, 
   loginAdmin,
   logoutAdmin,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentAdmin,
   updateAccountDetails,
   updateAdminAvatar,
   verifyToken // Import verifyToken controller
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post('/register',
   recaptchaMiddleware1,
   upload.fields([{ name: 'avatar', maxCount: 1 }]),
   registerAdmin
);

router.post('/login',
   recaptchaMiddleware2, 
   loginAdmin
);

router.post('/logout', verifyJWT, logoutAdmin);
router.post('/refresh-token', refreshAccessToken);
router.patch('/update-password', verifyJWT, changeCurrentPassword);
router.get('/current-admin', verifyJWT, getCurrentAdmin);
router.patch('/update-account', verifyJWT, updateAccountDetails);

router.post('/avatar',
   verifyJWT,
   upload.single('avatar'),
   updateAdminAvatar
);

// Add the verify-token route
router.post('/verify-token', verifyToken);

export default router;
