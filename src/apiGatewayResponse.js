import zlib from 'zlib'
import accepts from 'accepts'
import compressible from 'compressible'
import applyMiddleware from './applyMiddleware'
import logger from './logger'
import cspPolicies from './csp-policies'

// Apply headers we want to always set
export const enforcedHeaders = ({ headers, ...rest }) => ({
  ...rest,
  headers: {
    ...headers,
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  },
})

// Apply CSP headers
const cachedCspString = Object.keys(cspPolicies)
  .map(policy =>
    `${policy} ${cspPolicies[policy]} ${
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

// Gzip/deflate response body when appropriate
export const compress = ({ body, headers, ...rest }, request) => {
  const zlibOptions = {
    level: 5,
  }
  const compressHeaders = {}
  const compressBody = {}
  const accept = accepts(request)
  let encoding = accept.encoding(['gzip', 'deflate', 'identity'])

  // prefer gzip over deflate
  if (encoding === 'deflate' && accept.encoding(['gzip'])) {
    encoding = accept.encoding(['gzip', 'identity'])
  }

  // Gzip compression is only required when running in lambda,
  // as in our development/CI setup, this is handled by nginx:
  const weShouldCompress =
    !request.isOffline &&
    compressible(headers['content-type']) &&
    encoding &&
    encoding !== 'identity' &&
    body &&
    body.length > 256

  if (weShouldCompress) {
    const compressed =
      encoding === 'gzip' ? zlib.gzipSync(body, zlibOptions) : zlib.deflateSync(body, zlibOptions)

    compressBody.body = compressed.toString('base64')
    compressBody.isBase64Encoded = true
    compressHeaders['content-encoding'] = encoding
    compressHeaders['content-length'] = compressed.byteLength
  }

  return {
    ...rest,
    body,
    headers: { ...headers, ...compressHeaders },
    ...compressBody,
  }
}

export const contentLengthHeader = ({ body, headers, ...rest }) => ({
  ...rest,
  body,
  headers: {
    ...headers,
    'content-length': headers['content-length'] ? headers['content-length'] : body.length,
  },
})

// Logs request/response info for CloudWatch/Kibana
export const logResponse = (response, request) => {
  if (process.env.LOGGING) {
    logger(request, response).info()
  }

  return { ...response }
}

export const makeResponseObject = (
  body = '',
  statusCode = 200,
  { headers = {}, ...options } = {},
  contentType
) => ({
  statusCode,
  body,
  headers: {
    'content-type': contentType,
    ...headers,
  },
  ...options,
})

const text = (body, statusCode, options) =>
  makeResponseObject(body, statusCode, options, 'text/plain')

const html = (body, statusCode, options) =>
  makeResponseObject(body, statusCode, options, 'text/html')

const json = (body, statusCode, options) =>
  makeResponseObject(JSON.stringify(body), statusCode, options, 'application/json')

const redirect = (location, statusCode = 302) =>
  makeResponseObject(undefined, statusCode, {
    headers: {
      location,
    },
  })

export default (request, callback) =>
  [text, html, json, redirect].reduce(
    (methods, method) => ({
      ...methods,
      [method.name]: (...args) =>
        callback(
          null,
          applyMiddleware(
            [compress, cspHeaders, contentLengthHeader, enforcedHeaders, logResponse],
            method(...args),
            request
          )
        ),
    }),
    {}
  )
