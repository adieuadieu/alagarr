import { InterfaceRequest } from '../types'

const decodeBase64 = (encoded: string): string => {
  const bodyBuffer = Buffer.from(encoded, 'base64')

  return bodyBuffer.toString('utf8')
}

// Decodes the request body if it's been base64 encoded by API Gateway
export default function decodeBase64Body(
  request: InterfaceRequest,
): InterfaceRequest {
  return request.isBase64Encoded && typeof request.body === 'string'
    ? {
        ...request,
        body: decodeBase64(request.body),
      }
    : request
}
