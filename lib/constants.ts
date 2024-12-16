export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NextAdmin'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'An modern dashboard for book app '
export const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE) || 5


export const ROOT_ROUTE = '/';
export const STORE_ROUTE = '/store';
export const ADMIN_ROUTE = '/dashboard';
export const CLIENT_ROUTE = '/client';

export const SESSION_COOKIE_NAME = 'user_session';