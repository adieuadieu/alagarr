import { InterfaceAlagarrOptions, InterfaceRequest, InterfaceResponseData } from '../types'

// Apply headers we want to always set
export default function enforcedHeaders(
  response: InterfaceResponseData,
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions
): InterfaceResponseData {
  return {
    ...response,
    headers: {
      ...response.headers,
      ...options.headers ? options.headers : {},
    },
  }
}
