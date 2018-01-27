import { InterfaceRequest } from '../types'

// Normalize differenecs in service programming models
export default function normalizeProgrammingModel({
  httpMethod = '',
  queryStringParameters = null,
  ...request
}: InterfaceRequest): InterfaceRequest {
  return {
    ...request,
    httpMethod,
    method: httpMethod,
    provider: 'aws',
    query: queryStringParameters || {},
    queryStringParameters,
    source: request.requestContext ? 'api-gateway' : request.source,
  }
}
