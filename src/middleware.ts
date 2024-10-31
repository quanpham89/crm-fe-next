import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// export { auth as middleware } from "@/auth"

export  async function middleware (req: any) {
    const token = await auth();
    // Nếu không có token hoặc không có role, chuyển hướng về trang đăng nhập
    if (!token || !token.user?.role) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    

    if (!token || !token.user?.role) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (!token.user?.isActive) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/business')) {
        if (token.user.role !== 'BUSINESSMAN') {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }

    if (req.nextUrl.pathname.startsWith('/dashboard')) {
        if (token.user.role !== 'ADMIN' && token.user.role !== 'ADMINS') {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }

    

    // Nếu có token và có role, tiếp tục
    return NextResponse.next();
}
export const config = {
    matcher: [
    // '/((?!auth).*)(.+)|/verify',
    // "/((?!api|_next/static|_next/image|favicon.ico|/|/auth).*)",
    '/((?!api|_next/static|_next/image|favicon.ico|auth|verify|$).*)',
    ],
    }