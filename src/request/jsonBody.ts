import { InterfaceRequest } from '../types'
// import { ClientError } from '../utils/errors'

// Parses JSON request body, if there is one
export default function parseJsonBody(
  request: InterfaceRequest
): InterfaceRequest {
  const { headers, body } = request

  if (
    headers['content-type'] === 'application/json' &&
    typeof body === 'string'
  ) {
    try {
      const json = JSON.parse(body)
      return { ...request, body: json }
    } catch (error) {
      // throw ClientError('Invalid JSON payload in request-body.')
      return { ...request, body: {} }
    }
  }

  return request
}
