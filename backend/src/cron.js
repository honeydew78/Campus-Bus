import cron from 'node-cron';
// import { Seat } from './models/seat.models.js'; // Adjust the import path according to your project structure
import { Seat } from './models/seat.models';
// Schedule a task to reset seat bookings every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    try {
        console.log("Running midnight reset task...");
        await Seat.updateMany({}, { isBooked: false, bookedBy: null, bookingDate: null });
        console.log("Seat bookings have been reset successfully.");
    } catch (error) {
        console.error("Error resetting seat bookings:", error);
    }
});
