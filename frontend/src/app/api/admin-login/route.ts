import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;
    const secretToken = process.env.ADMIN_SECRET_TOKEN;

    if (!validEmail || !validPassword || !secretToken) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    if (email === validEmail && password === validPassword) {
        const res = NextResponse.json({ success: true });
        res.cookies.set(ADMIN_COOKIE, secretToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/',
        });
        return res;
    }

    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
}
