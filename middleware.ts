import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // Các trang public
    if (
        pathname === '/landing' ||
        pathname.startsWith('/landing/') ||
        pathname === '/auth/login'
    ) {
        return NextResponse.next();
    }

    // Các trang CMS cần đăng nhập
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico|theme|layout).*)']
};