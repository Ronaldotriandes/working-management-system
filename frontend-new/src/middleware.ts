import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
    exp: number;
}

const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode(token) as DecodedToken;
    if (!decoded?.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const isPublicPath = request.nextUrl.pathname === '/login' || 
                        request.nextUrl.pathname === '/register'

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isTokenExpired(token)) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth_token')
        return response
    }

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/work-orders/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}
