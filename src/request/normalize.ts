import { InterfaceRequest } from '../types'

// Lowercases all header names
export default function normalizeHeaders({
  headers = {},
  ...request,
}: InterfaceRequest): InterfaceRequest {
  return {
    ...request,
    headers: Object.keys(headers).reduce(
      (normalizedHeaders, key) => ({
        ...normalizedHeaders,
        [key.toLowerCase()]: headers[key],
      }),
      {}
    ),
  }
}
