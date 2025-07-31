import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { otp } from "@/models/otp";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, code, name, dob, action } = body;

    if (!email || !code || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find OTP entry
    const otpEntry = await otp.findOne({ email, code });
    if (!otpEntry) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    await otp.deleteOne({ _id: otpEntry._id });

    if (action === "signup") {
      if (!name || !dob) {
        return NextResponse.json(
          { success: false, message: "Name and DOB are required for signup" },
          { status: 400 }
        );
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      }
      const user = await User.create({ name, email, dob });
      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
      return NextResponse.json({
        success: true,
        message: "OTP verified and account created",
        user,
      });
    } else if (action === "signin") {
      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
      return NextResponse.json({
        success: true,
        message: "OTP verified, login successful",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
