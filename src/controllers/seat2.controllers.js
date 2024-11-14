import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Seat2 } from "../models/seat2.models.js";

// Get all seats and populate booked seats
const getAllSeat2s = asyncHandler(async (req, res, next) => {
  try {
    console.log("Fetching seats from the database...");
    const seat2s = await Seat2.find();
    console.log("Fetched Seat2s:", seat2s);
    
    if (!seat2s || seat2s.length === 0) {
      console.error("No seat2s found in the database.");
      throw new ApiError(404, "No seat2s found");
    }

    const bookedSeat2s = seat2s.filter(seat2 => seat2.isBooked);
    console.log("Booked Seat2s:", bookedSeat2s);

    return res.status(200).json(
      new ApiResponse(200, bookedSeat2s, "List of all booked seat2s")
    );
  } catch (error) {
    console.error("Error fetching seat2s:", error);
    next(error);
  }
});

// Book a seat
const bookSeat2 = asyncHandler(async (req, res, next) => {
  try {
    const { seatNumber} = req.body;
    console.log("Request to book seat received. Seat Number:", seatNumber);

    if (!seatNumber) {
      console.error("Seat number or user information is missing.");
      throw new ApiError(400, "Seat number and user information are required");
    }

    // Find the seat by seat number
    let seat2 = await Seat2.findOne({ seatNumber });
    console.log("Fetched Seat:", seat2);
    
    if (!seat2) {
      console.log("Seat not found, creating a new one.");
      // If the seat does not exist, create it with the given data
      seat2 = new Seat2({
        seatNumber,
        isBooked: true,
        bookingDate: new Date("2023-12-01") // Add a fake booking date
      });
    } else {
      // Check if the seat is already booked
      if (seat2.isBooked) {
        console.error("Seat is already booked.");
        throw new ApiError(409, "Seat is already booked");
      }

      // Book the seat
      console.log("Booking the seat...");
      seat2.isBooked = true;
      seat2.bookingDate = new Date("2023-12-01"); // Add a fake booking date
    }

    const updatedSeat = await seat2.save();
    if (!updatedSeat) {
      console.error("Failed to book the seat.");
      throw new ApiError(500, "Failed to book the seat");
    }

    console.log("Updated Seat:", updatedSeat);

    return res.status(200).json(
      new ApiResponse(200, updatedSeat, "Seat booked successfully")
    );
  } catch (error) {
    console.error("Error booking seat:", error);
    next(error);
  }
});

export {
  getAllSeat2s,
  bookSeat2
};
