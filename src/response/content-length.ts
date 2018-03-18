import { InterfaceResponseData } from '../types'

export default function contentLengthHeader(
  response: InterfaceResponseData,
): InterfaceResponseData {
  const { body, headers, ...rest } = response

  return {
    ...rest,
    body,
    headers: {
      ...headers,
      'content-length': headers['content-length'] || Buffer.byteLength(body),
    },
  }
}
