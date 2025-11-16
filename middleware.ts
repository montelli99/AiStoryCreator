import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect AI generation and director routes with API key validation
  if (pathname.startsWith('/api/generate') || 
      pathname.startsWith('/api/director') || 
      pathname.startsWith('/api/analytics')) {
    const apiKey = req.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API Key. Include x-api-key header in your request.' },
        { status: 401 }
      );
    }

    try {
      // Verify API key in database
      const key = await db.apiKey.findUnique({
        where: { key: apiKey },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      });

      if (!key || !key.isActive) {
        return NextResponse.json(
          { error: 'Invalid or inactive API Key' },
          { status: 403 }
        );
      }

      // Update last used timestamp
      await db.apiKey.update({
        where: { id: key.id },
        data: { lastUsedAt: new Date() }
      });

      // Add user info to request headers for downstream use
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', key.user.id);
      requestHeaders.set('x-user-email', key.user.email);
      requestHeaders.set('x-user-role', key.user.role);

      // Continue with the request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('API key verification error:', error);
      return NextResponse.json(
        { error: 'API key verification failed' },
        { status: 500 }
      );
    }
  }

  // Protect dashboard and settings routes - require session auth
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/settings') || 
      pathname.startsWith('/characters') ||
      pathname.startsWith('/content-queue') ||
      pathname.startsWith('/analytics') ||
      pathname === '/') {
    
    // Skip middleware for API routes and login page
    if (pathname.startsWith('/api/') || pathname === '/login') {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = req.cookies.get('next-auth.session-token');
    
    if (!sessionCookie) {
      // Redirect to login for protected routes
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};