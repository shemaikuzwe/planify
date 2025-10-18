import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = req.auth;
  const isOnLogin = req.nextUrl.pathname.startsWith("/auth/login");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  if (isApiRoute) return NextResponse.next();
  else if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  } else if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL("/", req.url));
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
  // ...(process.env.NODE_ENV === "production" && { runtime: "nodejs" }),
};
