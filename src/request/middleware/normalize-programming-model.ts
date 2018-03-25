import { InterfaceRequest } from '../../types'

// Normalize differenecs in service programming models
export default function normalizeProgrammingModel(
  request: InterfaceRequest,
): InterfaceRequest {
  return {
    ...request,
    method: request.httpMethod || '',
    provider: 'aws',
    query: request.queryStringParameters || {},
    source: request.requestContext ? 'api-gateway' : request.source,
  }
}
