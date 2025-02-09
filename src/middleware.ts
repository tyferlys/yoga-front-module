import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    if (!request.cookies.has('access_token')) {
        console.log("Редирект")
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    console.log("запрос прошел")
    return NextResponse.next();
}

export const config = {
    matcher: ['/profile'],
};
