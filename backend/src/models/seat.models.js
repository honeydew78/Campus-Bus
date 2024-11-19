import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema({
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

export const Seat = mongoose.model("seat", seatSchema);
