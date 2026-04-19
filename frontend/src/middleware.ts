import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /admin routes (but not /admin/login itself)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const session = req.cookies.get(ADMIN_COOKIE);
        if (!session || session.value !== process.env.ADMIN_SECRET_TOKEN) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = '/admin/login';
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
