import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL = 5 mins
  action: { type: String, default: "signup" },
});

export const otp = mongoose.models.otp || mongoose.model("otp", otpSchema);
