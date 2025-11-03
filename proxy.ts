import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = req.auth;
  const isOnHome = req.nextUrl.pathname === "/";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  if (isApiRoute) return NextResponse.next();
  else if (!isLoggedIn && !isOnHome) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (isLoggedIn && isOnHome) {
    return NextResponse.redirect(new URL("/app", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  // runtime: "nodejs",
};
