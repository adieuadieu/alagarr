import parseRequest from './apiGatewayRequest'
import makeResponse from './apiGatewayResponse'

const defaultOptions = {
  requestMiddleware: [],
  responseMiddleware: [],
  cspPolicies: [],
}

export default function alagarr (handler = () => undefined, options = defaultOptions) {
  return async function alagar (event, context, callback) {
    const request = parseRequest(event, context)
    const response = makeResponse(request, callback)

    handler(request, response)
  }
}
