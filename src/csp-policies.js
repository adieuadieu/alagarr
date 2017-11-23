export default {
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
