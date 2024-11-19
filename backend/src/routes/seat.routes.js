import { Router } from "express";
import { getAllSeats,bookSeat} from "../controllers/seat.controllers.js";

const router = Router()

router.get('/get-seats',getAllSeats);
router.post('/book-seat',bookSeat);

export default router