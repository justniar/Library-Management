import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;

interface DecodedToken extends JwtPayload {
  role: string;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; 

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/not-authorized", req.url)); 
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard-admin", "/history-user", "/history-book"],
};
