import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

// Somewhat lazy implementation, but cheaper than verifying the string with
// JSON.parse() to see if it's a JSON string.
function stringifyIfNotStringifiedJson(data: any): string {
  const maybeTrimmedDataString = typeof data === 'string' ? data.trim() : data

  const isStringifiedJson =
    typeof data === 'string' &&
    ['{', '"'].includes(maybeTrimmedDataString[0]) &&
    ['}', '"'].includes(
      maybeTrimmedDataString[maybeTrimmedDataString.length - 1],
    )

  return isStringifiedJson ? maybeTrimmedDataString : JSON.stringify(data)
}

const json: ResponseHelper = (
  responseData: InterfaceResponseData,
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(
    responseData,
    stringifyIfNotStringifiedJson(body),
    statusCode,
    options,
    'application/json',
  )

export default json
