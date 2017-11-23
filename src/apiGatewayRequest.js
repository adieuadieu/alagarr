import { parse as parseCookie } from 'cookie'
import applyMiddleware from './applyMiddleware'

// Lowercases all header names
export const normalizeHeaders = ({ headers = {}, ...request }) => ({
  ...request,
  headers: Object.keys(headers).reduce(
    (normalizedHeaders, key) => ({
      ...normalizedHeaders,
      [key.toLowerCase()]: headers[key],
    }),
    {}
  ),
})

// Decodes the request body if it's been base64 encoded by API Gateway
export const decodeBase64Body = (request) => {
  if (request.isBase64Encoded && request.body) {
    const bodyBuffer = Buffer.from(request.body, 'base64')

    return {
      ...request,
      body: bodyBuffer.toString('utf8'),
    }
  }

  return request
}

// Parses cookies out of cookie header
export const parseCookies = request => ({
  ...request,
  cookies: parseCookie((request.headers && request.headers.cookie) || ''),
})

// Parses JSON request body, if there is one
export const parseJsonBody = (request) => {
  const { headers } = request
  let { body } = request

  if (headers['content-type'] === 'application/json' && typeof body === 'string' && body.length) {
    try {
      body = JSON.parse(body)
    } catch (error) {
      console.warn('Unable to parse request json-body.', body)
      body = {}
    }
  }

  return { ...request, body }
}

// Sets the hostname on the request object
export const setHostname = request => ({
  ...request,
  hostname: request.headers.host,
})

// Adds a timestamp for use in calculating ellapsed duration
export const addTimestamp = request => ({
  ...request,
  timestamp: Date.now(),
})

/*
parse a Lambda APIG event into a request object by
running the request event through list of middleware
*/
export default (event, context) =>
  applyMiddleware(
    [addTimestamp, normalizeHeaders, decodeBase64Body, parseCookies, parseJsonBody, setHostname],
    { ...event, context }
  )
