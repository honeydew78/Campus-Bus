import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  seatNo: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  journey: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);