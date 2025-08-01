import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("Token in middleware:", token);

  if (request.nextUrl.pathname === "/") {
    if (!token) {
      console.log("No token found, redirecting...");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    try {
      // jose expects a Uint8Array for the secret
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      console.log("Token verified!");
    } catch (e) {
      console.log("Token invalid:", e);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
