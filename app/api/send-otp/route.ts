import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // your MongoDB connector
import { otp } from "@/models/otp";
import { sendOTP } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();
    // console.log(email);

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(generatedOtp);

    await otp.create({ email, code: generatedOtp });

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
