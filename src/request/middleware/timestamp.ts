import { InterfaceRequest } from '../../types'

// Adds a timestamp for use in calculating ellapsed duration
export default function addTimestamp(
  request: InterfaceRequest,
): InterfaceRequest {
  return {
    ...request,
    timestamp: Date.now(),
  }
}
