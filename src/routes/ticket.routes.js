import { Router } from "express";
import { bookTicket, getTicketsByEmail, deleteTicket, deleteTicket2 } from "../controllers/ticket.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get('/get-ticket', verifyJWT, getTicketsByEmail);
router.post('/book-ticket', bookTicket);
router.delete('/delete-ticket', verifyJWT, deleteTicket);
router.delete('/delete-ticket2', verifyJWT, deleteTicket2);



export default router;
