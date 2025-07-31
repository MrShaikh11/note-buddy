import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, dob } = body;

    const user = await User.create({ name, email, dob });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error in create-user:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
