import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  // Proteger rotas de dashboard (cliente)
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Proteger rotas de prestador
  if (pathname.startsWith("/provider") && (!isAuthenticated || userRole !== "PROVIDER")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirecionar usuários já autenticados que tentam acessar login/register
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    if (userRole === "PROVIDER") {
      return NextResponse.redirect(new URL("/provider/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/provider/:path*", "/login", "/register"],
};
