import { parse as parseCookie } from 'cookie'

// Parses cookies out of cookie header
export const parseCookies = request => ({
  ...request,
  cookies: parseCookie((request.headers && request.headers.cookie) || ''),
})
