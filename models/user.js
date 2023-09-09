const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
    validate: {
      validator: function (code) {
        return /^\d{6}$/.test(code);
      },
      message: "OTP must be a 6-digit number.",
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
  userId: {
    type: String,
    unique: true,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  middleName: {
    type: String,
    required: false,
  },
  bookingHistory: {
    type: [String],
    default: [],
  },
  scheduledBookings: {
    type: [String],
    default: [],
  },
  referralId: {
    type: String,
    unique: true,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
