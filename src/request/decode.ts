import { InterfaceRequest } from '../types'

// Decodes the request body if it's been base64 encoded by API Gateway
export default function decodeBase64Body(request: InterfaceRequest): InterfaceRequest {
  if (request.isBase64Encoded && typeof request.body === 'string') {
    const bodyBuffer = Buffer.from(request.body, 'base64')

    return {
      ...request,
      body: bodyBuffer.toString('utf8'),
    }
  }

  return request
}
