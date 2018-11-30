import { InterfaceResponseData, InterfaceResponseOptions } from '../types'

export default function makeResponseObject(
  responseData?: InterfaceResponseData,
  body = '',
  statusCode = 200,
  { headers = {}, ...options }: InterfaceResponseOptions = {},
  contentType?: string,
): InterfaceResponseData {
  return Object.freeze({
    ...(responseData || {}),
    body: body || '',
    headers: {
      ...((responseData && responseData.headers) || {}),
      'content-type': contentType,
      ...headers,
    },
    statusCode,
    ...options,
  })
}
