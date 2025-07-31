import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true, user });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
