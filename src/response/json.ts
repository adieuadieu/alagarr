import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

// Somewhat lazy implementation, but cheaper than verifying the string with
// JSON.parse() to see if it's a JSON string.
function stringifyIfNotStringifiedJson(data: any): string {
  const isStringifiedJson =
    typeof data === 'string' &&
    ['{', '"'].includes(data[0]) &&
    ['}', '"'].includes(data[data.length - 1])

  return isStringifiedJson ? data : JSON.stringify(data)
}

const json: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(
    stringifyIfNotStringifiedJson(body),
    statusCode,
    options,
    'application/json',
  )

export default json
