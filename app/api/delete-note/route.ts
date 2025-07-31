import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/note";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function DELETE(req: Request) {
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

  const { id } = await req.json();
  if (!id)
    return NextResponse.json(
      { success: false, message: "Note ID required" },
      { status: 400 }
    );

  const note = await Note.findOneAndDelete({ _id: id, userEmail: email });
  if (!note)
    return NextResponse.json(
      { success: false, message: "Note not found" },
      { status: 404 }
    );

  return NextResponse.json({ success: true });
}
