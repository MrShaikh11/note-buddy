import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "No credential received" },
        { status: 400 }
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.name) {
      return NextResponse.json(
        { success: false, message: "Invalid Google token" },
        { status: 400 }
      );
    }

    // Check or create user
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        image: payload.picture,
      });
    }

    // Create JWT
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Set cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message: "Google login successful",
      user,
    });
  } catch (err) {
    console.error("Google login error:", err);
    return NextResponse.json(
      { success: false, message: "Google login failed" },
      { status: 500 }
    );
  }
}
