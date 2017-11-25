const policies = {
  'default-src': "'self'",
  'font-src': "'self' https://fonts.gstatic.com https://netdna.bootstrapcdn.com/font-awesome/",
  'script-src':
    "'self' 'unsafe-inline' 'unsafe-eval' https://*.google-analytics.com https://*.google.com https://*.gstatic.com https://*.mxpnl.com/ https://mixpanel.com",
  'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
  'img-src': '* data: blob:',
  'connect-src': '*',
  'child-src': '*',
  'frame-src': '*',
  'frame-ancestors': "'self'",
  'report-uri': '/csp-reports',
}

// Apply CSP headers
const cachedCspString = Object.keys(policies)
  .map(policy =>
    `${policy} ${policies[policy]} ${
      policy.substr(-4) === '-src' && process.env.CDN_HOST_URL
        ? process.env.CDN_HOST_URL // add the CDN as a permitted origin
        : ''
    }`)
  .join(';')

export const cspHeaders = ({ headers, ...rest } = {}, request) => ({
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
    'content-security-policy': cachedCspString,

    // Map "frame-ancestors" to the equivalent "X-Frame-Options":
    'x-frame-options':
      {
        "'self'": 'SAMEORIGIN',
        "'none'": 'DENY',
      }[cspPolicies['frame-ancestors']] || undefined,
  },
})
