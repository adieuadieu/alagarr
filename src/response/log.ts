import { InterfaceAlagarrOptions, InterfaceRequest, InterfaceResponseData } from '../types'

// Logs request/response info for CloudWatch/Kibana
export default function logResponse(
  response: InterfaceResponseData,
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions
): InterfaceResponseData {
  if (options.enableLogger) {
    // We have no choice here but to disable the rule.
    // tslint:disable-next-line:no-expression-statement
    options.logger(request, response)
  }

  return response
}
