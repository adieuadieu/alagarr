import { InterfaceAlagarrOptions, InterfaceRequest, InterfaceResponseData } from '../types'
import logger from '../utils/logger'

// Logs request/response info for CloudWatch/Kibana
export default function logResponse(
  response: InterfaceResponseData,
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions
): InterfaceResponseData {
  if (options.enableLogger) {
    // We have no choice here but to disable the rule.
    // tslint:disable:no-expression-statement
    if (typeof options.logger === 'function') {
      options.logger(request, response)
    } else {
      logger(request, response)
    }
  }

  return response
}
