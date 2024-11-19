import mongoose, { Schema } from "mongoose";

const seat2Schema = new Schema({
   seatNumber: {
      type: Number,
      required: true,
      unique: true
   },
   isBooked: {
      type: Boolean,
      default: false
   },
   bookingDate: {
      type: Date,
      default: null
   }
}, { timestamps: true });

export const Seat2 = mongoose.model("seat2", seat2Schema);
