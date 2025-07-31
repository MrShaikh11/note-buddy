import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/note";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function POST(req: Request) {
  await connectDB();
  const token = (await cookies()).get("token")?.value;
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  let email;
  try {
    const { payload } = await jwtVerify(token, secret);
    email = payload.email;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }

  const { content } = await req.json();
  if (!content)
    return NextResponse.json(
      { success: false, message: "Note content required" },
      { status: 400 }
    );

  const note = await Note.create({ userEmail: email, content });
  return NextResponse.json({ success: true, note });
}

export async function GET() {
  await connectDB();
  const token = (await cookies()).get("token")?.value;
  if (!token)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  let email;
  try {
    const { payload } = await jwtVerify(token, secret);
    email = payload.email;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }

  const notes = await Note.find({ userEmail: email }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, notes });
}
