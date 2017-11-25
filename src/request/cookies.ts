import { parse as parseCookie } from 'cookie'
import { InterfaceRequest } from '../types'

// Parses cookies out of cookie header
export default function cookies(request: InterfaceRequest): InterfaceRequest {
  return {
    ...request,
    cookies: parseCookie((request.headers && request.headers.cookie) || ''),
  }
}
