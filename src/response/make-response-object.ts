import { InterfaceResponseData, InterfaceResponseOptions } from '../types'

export default function makeResponseObject(
  body: string,
  statusCode = 200,
  { headers = {}, ...options }: InterfaceResponseOptions = {},
  contentType?: string,
): InterfaceResponseData {
  return Object.freeze({
    body,
    headers: {
      'content-type': contentType,
      ...headers,
    },
    statusCode,
    ...options,
  })
}
