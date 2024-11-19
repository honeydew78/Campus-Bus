import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/ticket.models.js";
import { Admin } from "../models/admin.models.js";
import { Seat } from "../models/seat.models.js"; // Assuming there's a Seat model to manage seat information
import { Seat2 } from "../models/seat2.models.js";

// Book a ticket
const bookTicket = asyncHandler(async (req, res, next) => {
  try {
    const { email, seatNo, date, journey } = req.body;
    console.log("Request to book ticket received. Data:", req.body);

    if (!email || !seatNo || !date || !journey) {
      console.error("Missing required fields for booking.");
      throw new ApiError(400, "Email, seat number, date, and journey are required");
    }

    // Create a new booking entry
    const newBooking = new Booking({
      email,
      seatNo,
      date: new Date(date),
      journey,
    });

    const savedBooking = await newBooking.save();
    if (!savedBooking) {
      console.error("Failed to book the ticket.");
      throw new ApiError(500, "Failed to book the ticket");
    }

    console.log("New Booking Created:", savedBooking);

    return res.status(200).json(
      new ApiResponse(200, savedBooking, "Ticket booked successfully")
    );
  } catch (error) {
    console.error("Error booking ticket:", error);
    next(error);
  }
});

// Get all tickets for a user by email
const getTicketsByEmail = asyncHandler(async (req, res, next) => {
  const adminId = req.admin.id;

  // Find admin by ID
  let admin = await Admin.findById(adminId);
  console.log(admin);

  // Check if admin exists
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  try {
    const email = admin.email;

    if (!email) {
      console.error("Email is required to retrieve tickets.");
      throw new ApiError(400, "Email is required to retrieve tickets");
    }

    const tickets = await Booking.find({ email });
    console.log("Fetched Tickets:", tickets);

    if (!tickets || tickets.length === 0) {
      console.error("No tickets found for the given email.");
      throw new ApiError(404, "No tickets found for the given email");
    }

    return res.status(200).json(
      new ApiResponse(200, tickets, "List of all booked tickets for the user")
    );
  } catch (error) {
    console.error("Error fetching tickets:", error);
    next(error);
  }
});

// Delete a ticket
const deleteTicket = asyncHandler(async (req, res, next) => {
  try {
    const { seatNumber, journey } = req.body;
    console.log("Request to delete ticket received. Data:", req.body);

    if (!seatNumber || !journey) {
      console.error("Missing required fields for deleting ticket.");
      throw new ApiError(400, "Seat number and journey are required to delete the ticket");
    }

    if (journey !== 'IIIT to Civil Lines') {
      console.error("Invalid journey. Only 'IIIT to Civil Lines' tickets can be deleted.");
      throw new ApiError(400, "Only 'IIIT to Civil Lines' tickets can be deleted");
    }

    // Delete the ticket from Booking
    const deletedTicket = await Booking.findOneAndDelete({ seatNo: seatNumber, journey });
    if (!deletedTicket) {
      console.error("Failed to delete the ticket. Ticket not found.");
      throw new ApiError(404, "Ticket not found");
    }

    // Delete the seat from Seat
    const deletedSeat = await Seat.findOneAndDelete({ seatNumber });
    if (!deletedSeat) {
      console.error("Failed to delete the seat. Seat not found.");
      throw new ApiError(404, "Seat not found");
    }

    console.log("Ticket Deleted:", deletedTicket);
    console.log("Seat Deleted:", deletedSeat);

    return res.status(200).json(
      new ApiResponse(200, { deletedTicket, deletedSeat }, "Ticket and seat deleted successfully")
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    next(error);
  }
});

const deleteTicket2 = asyncHandler(async (req, res, next) => {
  try {
    const { seatNumber, journey } = req.body;
    console.log("Request to delete ticket received. Data:", req.body);

    if (!seatNumber || !journey) {
      console.error("Missing required fields for deleting ticket.");
      throw new ApiError(400, "Seat number and journey are required to delete the ticket");
    }

    if (journey !== 'Civil Lines to IIIT') {
      console.error("Invalid journey. Only 'Civil Lines to IIIT' tickets can be deleted.");
      throw new ApiError(400, "Only 'Civil Lines to IIIT Lines' tickets can be deleted");
    }

    // Delete the ticket from Booking
    const deletedTicket = await Booking.findOneAndDelete({ seatNo: seatNumber, journey });
    if (!deletedTicket) {
      console.error("Failed to delete the ticket. Ticket not found.");
      throw new ApiError(404, "Ticket not found");
    }

    // Delete the seat from Seat
    const deletedSeat = await Seat2.findOneAndDelete({ seatNumber });
    if (!deletedSeat) {
      console.error("Failed to delete the seat. Seat not found.");
      throw new ApiError(404, "Seat not found");
    }

    console.log("Ticket Deleted:", deletedTicket);
    console.log("Seat2 Deleted:", deletedSeat);

    return res.status(200).json(
      new ApiResponse(200, { deletedTicket, deletedSeat }, "Ticket and seat deleted successfully")
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    next(error);
  }
});


export {
  bookTicket,
  getTicketsByEmail,
  deleteTicket,
  deleteTicket2
};
