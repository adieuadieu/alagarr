import parseRequest from './apiGatewayRequest'
import makeResponse from './apiGatewayResponse'

export default async function alagarr (handler = () => undefined) {
  return function alagar (event, context, callback) {
    const request = parseRequest(event, context)
    const response = makeResponse(request, callback)

    handler(request, response)
  }
}
