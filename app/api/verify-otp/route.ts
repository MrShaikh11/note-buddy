import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Otp } from "@/models/Otp";

export async function POST(req) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    const otpEntry = await Otp.findOne({ email, code });

    if (!otpEntry) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Optionally delete OTP after verification
    await Otp.deleteOne({ _id: otpEntry._id });

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
