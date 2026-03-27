import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  if (pathname === "/login" && isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname !== "/login" && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
