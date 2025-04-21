import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export default auth((req) => {
  const isLoggedIn = req.auth;
  const isOnLogin = req.nextUrl.pathname.startsWith("/auth/login");
  if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  } else if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
