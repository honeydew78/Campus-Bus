import { Router } from "express";
import {
   convertToCurrentTrainee,
   getAllCurrentTrainee,
   getCurrentTrainee,
   updateAccountDetails,
   deleteCurrentTrainee
}  from "../controllers/currentTrainee.controllers.js";

const router = Router()

router.post('/register',convertToCurrentTrainee)
router.post('/:id/update', updateAccountDetails); // Update trainee details
router.post('/:id/delete', deleteCurrentTrainee); // Delete a trainee
router.post('/:id/convert-to-current',convertToCurrentTrainee)
router.get('/:id', getCurrentTrainee); // Get a trainee by ID (GET method)
router.get('/',getAllCurrentTrainee) // Get all new trainees

export default router

