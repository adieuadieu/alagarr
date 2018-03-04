import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponseData,
} from '../types'
import logger from '../utils/logger'

// Logs request/response info
export default function logResponse(
  response: InterfaceResponseData,
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions,
): InterfaceResponseData {
  return (
    ((typeof options.logger === 'function'
      ? options.logger(request, response)
      : logger(request, response)) &&
      response) ||
    response
  )
}
