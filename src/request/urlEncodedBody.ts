import * as querystring from 'querystring'
import { InterfaceRequest } from '../types'

// Parses urlEncoded request body, if there is one
// this is a more naive version of:
// https://github.com/expressjs/body-parser/blob/master/lib/types/urlencoded.js
export default function parseJsonBody(
  request: InterfaceRequest
): InterfaceRequest {
  const { headers, body } = request

  if (
    headers['content-type'] === 'application/x-www-form-urlencoded' &&
    typeof body === 'string'
  ) {
    const decoded = querystring.parse(body)
    return { ...request, body: decoded }
  }

  return request
}
