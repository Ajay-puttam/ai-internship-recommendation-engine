import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/profile-setup"];
const AUTH_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("ai_intern_token")?.value;
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

    // Redirect unauthenticated users away from protected routes
    if (isProtected && !token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && token) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile-setup", "/login"],
};
