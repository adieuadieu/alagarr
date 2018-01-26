import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponseData,
} from '../types'

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
const DEFAULT_POLICIES = {
  'default-src': "'self'",
  'img-src': '* data: blob:',
}

// Apply CSP headers
export default function cspHeaders(
  response: InterfaceResponseData,
  _: InterfaceRequest,
  options: InterfaceAlagarrOptions,
): InterfaceResponseData {
  const { headers = {}, ...rest } = response

  const cspPolicies = {
    ...DEFAULT_POLICIES,
    ...options.cspPolicies,
  } as any
  const cspPolicy = Object.keys(cspPolicies)
    .map((policy: string): string => `${policy} ${cspPolicies[policy]}`)
    .join(';') as any

  return {
    ...rest,
    headers: {
      ...headers,

      // Only transmit the origin cross-domain and no referer without HTTPS:
      'referrer-policy': 'strict-origin-when-cross-origin',

      // Instruct browsers to strictly follow the Content-Type header:
      'x-content-type-options': 'nosniff',

      // Always enable the browser XSS protection:
      'x-xss-protection': '1; mode=block',

      // Convert the csp options in package.json to a policies list:
      'content-security-policy': cspPolicy,

      // Map "frame-ancestors" to the equivalent "X-Frame-Options":
      'x-frame-options':
        ({
          "'none'": 'DENY',
          "'self'": 'SAMEORIGIN',
        } as any)[cspPolicies['frame-ancestors']] || undefined,
    },
  }
}
