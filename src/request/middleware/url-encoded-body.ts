import * as querystring from 'querystring'
import { InterfaceRequest } from '../../types'

// Parses urlEncoded request body, if there is one
// this is a more naive version of:
// https://github.com/expressjs/body-parser/blob/master/lib/types/urlencoded.js
export default function parseUrlEncodedBody(
  request: InterfaceRequest,
): InterfaceRequest {
  const { headers, body } = request

  return headers['content-type'].split(';').shift() === 'application/x-www-form-urlencoded' &&
    typeof body === 'string'
    ? { ...request, body: querystring.parse(body) }
    : request
}
