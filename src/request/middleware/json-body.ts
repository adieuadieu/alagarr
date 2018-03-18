import { InterfaceRequest } from '../../types'
// import { ClientError } from '../utils/errors'

const parseJson = (stringified: string): any => {
  try {
    return JSON.parse(stringified)
  } catch {
    // throw ClientError('Invalid JSON payload in request-body.')
    return {}
  }
}

// Parses JSON request body, if there is one
export default function parseJsonBody(
  request: InterfaceRequest,
): InterfaceRequest {
  const { headers, body } = request

  return headers['content-type'] === 'application/json' &&
    typeof body === 'string'
    ? { ...request, body: parseJson(body) }
    : request
}
