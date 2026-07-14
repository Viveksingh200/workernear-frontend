import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // Define guest routes (only accessible if NOT logged in)
  const guestRoutes = ['/login', '/register'];

  // Define protected routes (only accessible if logged in)
  const protectedRoutes = ['/profile', '/worker/dashboard', '/worker/profile', '/admin'];

  const isGuestRoute = guestRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect authenticated users away from guest routes (e.g. login, register)
  if (authToken && isGuestRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users away from protected routes to login
  if (!authToken && isProtectedRoute) {
    // Optionally append a redirect parameter to send them back after login
    const loginUrl = new URL('/login', request.url);
    // loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin role check for /admin routes
  if (pathname.startsWith('/admin') && authToken) {
    try {
      // Decode JWT payload to check role (header.payload.signature)
      const payloadBase64 = authToken.split('.')[1];
      if (payloadBase64) {
        // Handle base64url encoding
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        // Decode base64 to string using atob (Edge runtime compatible)
        const jsonPayload = atob(base64);
        const decodedPayload = JSON.parse(jsonPayload);
        
        if (decodedPayload.role !== 'admin') {
          // If the role is not admin, redirect to homepage or forbidden
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (err) {
      console.error('Error parsing token payload in middleware', err);
      // On parsing error, play it safe and redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Let the request proceed normally
  return NextResponse.next();
}

// Config to specify which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images or static assets in public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
