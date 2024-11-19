import { Router } from "express";
import { getAllSeat2s,bookSeat2 } from "../controllers/seat2.controllers.js";

const router = Router()

router.get('/get-seat2s',getAllSeat2s);
router.post('/book-seat2',bookSeat2);

export default router