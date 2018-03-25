import { InterfaceResponseData } from '../types'

export default function makeResponseObject(
  body: string,
  statusCode: number = 200,
  { headers = {}, ...options } = {},
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
