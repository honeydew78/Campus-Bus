import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Seat } from "../models/seat.models.js";

// Get all seats and populate booked seats
const getAllSeats = asyncHandler(async (req, res, next) => {
  try {
    console.log("Fetching seats from the database...");
    const seats = await Seat.find();
    console.log("Fetched Seats:", seats);
    
    if (!seats || seats.length === 0) {
      console.error("No seats found in the database.");
      throw new ApiError(404, "No seats found");
    }

    const bookedSeats = seats.filter(seat => seat.isBooked);
    console.log("Booked Seats:", bookedSeats);

    return res.status(200).json(
      new ApiResponse(200, bookedSeats, "List of all booked seats")
    );
  } catch (error) {
    console.error("Error fetching seats:", error);
    next(error);
  }
});

// Book a seat
const bookSeat = asyncHandler(async (req, res, next) => {
  try {
    const { seatNumber } = req.body;
    console.log("Request to book seat received. Seat Number:", seatNumber);

    if (!seatNumber) {
      console.error("Seat number or user information is missing.");
      throw new ApiError(400, "Seat number and user information are required");
    }

    // Find the seat by seat number
    let seat = await Seat.findOne({ seatNumber });
    console.log("Fetched Seat:", seat);
    
    if (!seat) {
      console.log("Seat not found, creating a new one.");
      // If the seat does not exist, create it with the given data
      seat = new Seat({
        seatNumber,
        isBooked: true,
        bookingDate: new Date("2023-12-01") // Add a fake booking date
      });
    } else {
      // Check if the seat is already booked
      if (seat.isBooked) {
        console.error("Seat is already booked.");
        throw new ApiError(409, "Seat is already booked");
      }

      // Book the seat
      console.log("Booking the seat...");
      seat.isBooked = true;
      seat.bookingDate = new Date("2023-12-01"); // Add a fake booking date
    }

    const updatedSeat = await seat.save();
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
  getAllSeats,
  bookSeat
};
