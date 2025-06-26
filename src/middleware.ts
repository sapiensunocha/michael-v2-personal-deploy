import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/map", "/upload", "/dashboard"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- TEMPORARY BYPASS FOR DEVELOPMENT ---
  // To enable this bypass, create a .env.local file in your project root
  // and add: NEXT_PUBLIC_BYPASS_AUTH=true
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    console.log("Authentication bypassed for development.");
    // If you want to automatically redirect to a specific page when bypassed,
    // you can add: return NextResponse.redirect(new URL("/map", req.url));
    // Otherwise, just let the request proceed to its original destination.
    return NextResponse.next();
  }
  // --- END TEMPORARY BYPASS ---

  const cookie = req.cookies.get("token");
  const token = cookie?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (pathname === "/logout") {
    const response = NextResponse.redirect(new URL("/signin", req.url));
    response.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
      domain: process.env.DOMAIN_NAME,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  }

  // If authenticated and trying to access signin or welcome, redirect to map
  if ((pathname.startsWith("/signin") || pathname === "/welcome") && token) {
    return NextResponse.redirect(new URL("/map", req.url));
  }

  // If it's a protected route and no token, redirect to signin
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

// You might also want to add a matcher config here if you don't have one,
// but it seems to be working globally if omitted, which is often the default.
// If you start seeing issues with other paths, we might need to add:
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };