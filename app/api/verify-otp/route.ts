import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { otp } from "@/models/otp";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    console.log("hello"); // This should now appear
    await connectDB();

    const body = await req.json();
    console.log("Request body:", body);

    const { email, code, name, dob } = body;

    console.log("Looking for OTP with email:", email, "and code:", code);

    const otpEntry = await otp.findOne({ email, code });
    console.log("OTP entry found:", otpEntry);

    if (!otpEntry) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    await otp.deleteOne({ _id: otpEntry._id });

    const user = await User.create({ name, email, dob });
    console.log("User created:", user);

    console.log("OTP verified successfully");
    return NextResponse.json({
      success: true,
      message: "OTP verified and account created",
    });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
