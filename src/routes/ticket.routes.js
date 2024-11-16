import { Router } from "express";
import { bookTicket,getTicketsByEmail } from "../controllers/ticket.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.get('/get-ticket',verifyJWT, getTicketsByEmail);
router.post('/book-ticket',bookTicket);

export default router