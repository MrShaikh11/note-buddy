import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { otp } from "@/models/otp";
import { sendOTP } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await otp.deleteMany({ email });

    await otp.create({
      email,
      code: generatedOtp,
      createdAt: new Date(),
    });

    await sendOTP(email, generatedOtp);

    return NextResponse.json({ success: true, message: "OTP sent!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error sending OTP" },
      { status: 500 }
    );
  }
}
