import { type NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_ROUTE,
  STORE_ROUTE,
  ROOT_ROUTE,
  SESSION_COOKIE_NAME,
  CLIENT_ROUTE,
} from './lib/constants';
import jwt from 'jsonwebtoken';
import { UserInfo } from '@/lib/dashboardTypes';

const protectedRoutes = [ADMIN_ROUTE, STORE_ROUTE, CLIENT_ROUTE];

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Exclude static assets and Next.js internals
  if (
    path.startsWith('/_next') || // Next.js built-in files
    path.startsWith('/static') || // Custom static files in public/
    /\.(ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot|otf)$/.test(path) // Static asset extensions
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';
  const jwtToken = request.cookies.get('jwtcookie')?.value || '';
  const decodedJwtToken = jwt.decode(jwtToken) as UserInfo | null;

  // Redirect to login if session or token is missing
  if (!session || !jwtToken || !decodedJwtToken) {
    const protectedPathPattern = /^\/store\/\w+/;

    if (
      protectedRoutes.includes(path) ||
      protectedPathPattern.test(path)
    ) {
      const loginURL = new URL(ROOT_ROUTE, url.origin);
      return NextResponse.redirect(loginURL.toString());
    }
    return NextResponse.next();
  }

  // If session is active and user tries to access root, redirect based on userType
  if (path === ROOT_ROUTE) {
    let redirectRoute = ADMIN_ROUTE; // Default to admin

    if (decodedJwtToken.userType === 'store') {
      redirectRoute = `${STORE_ROUTE}/${decodedJwtToken.uid}`;
    } else if (decodedJwtToken.userType === 'client') {
      redirectRoute = CLIENT_ROUTE;
    }

    const absoluteURL = new URL(redirectRoute, url.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Handle specific user types and their routes
  if (decodedJwtToken.userType === 'store') {
    const dynamicStoreRoute = `${STORE_ROUTE}/${decodedJwtToken.uid}`;

    // Allow store user only on their specific routes
    if (
      !path.startsWith(dynamicStoreRoute) &&
      !path.startsWith(STORE_ROUTE)
    ) {
      const storeURL = new URL(dynamicStoreRoute, url.origin);
      return NextResponse.redirect(storeURL.toString());
    }
  }

  if (decodedJwtToken.userType === 'client') {
    // Redirect clients away from admin routes
    if (path.startsWith(ADMIN_ROUTE)) {
      const clientURL = new URL(CLIENT_ROUTE, url.origin);
      return NextResponse.redirect(clientURL.toString());
    }
  }

  // Admin users are unrestricted
  if (decodedJwtToken.userType === 'admin') {
    return NextResponse.next();
  }

  // Default to next response for unmatched conditions
  return NextResponse.next();
}