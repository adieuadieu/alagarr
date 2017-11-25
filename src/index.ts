import parseRequest from './request'
import makeResponse from './response'
import {
  Alagarr,
  AlagarrHandler,
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponse,
} from './types'
import { ClientError, ServerError } from './utils/errors'

const noopHandler = (request, response) =>
  response.json({
    error: 'Misconfiguration in Alagarr setup. Failed to provide a handler function.',
  })

const defaultOptions = {
  cspPolicies: [],
  requestMiddleware: [],
  responseMiddleware: [],
}

export { InterfaceRequest, InterfaceResponse, ClientError, ServerError }

export default function alagarr(
  handler: AlagarrHandler = noopHandler,
  options: InterfaceAlagarrOptions = defaultOptions
): Alagarr {
  return async function handlerWrapper(event, context, callback): void {
    const request = parseRequest(event, context, options)
    const response = makeResponse(request, callback, options)

    return handler(request, response)
  }
}
