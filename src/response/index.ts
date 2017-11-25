import applyMiddleware from '../utils/applyMiddleware'
import compress from './compress'
import csp from './csp'
import contentLength from './content-length'
import strictTransportSecurity from './strict-transport-security'
import log from './log'

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
            [compress, csp, contentLength, strictTransportSecurity, log],
            method(...args),
            request
          )
        ),
    }),
    {}
  )
