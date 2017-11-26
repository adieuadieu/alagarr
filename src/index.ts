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
import logger from './utils/logger'

const DEFAULT_OPTIONS = {
  cspPolicies: [],
  enableCompression: true,
  enableContentLength: true,
  enableCspHeaders: true,
  enableLogger: true,
  enableStrictTransportSecurity: true,
  logger,
  requestMiddleware: [],
  responseMiddleware: [],
}

const noopHandler = (request: InterfaceRequest, response: InterfaceResponse) =>
  response.json({
    error: 'Misconfiguration in Alagarr setup. Failed to provide a handler function.',
  })

export { InterfaceRequest, InterfaceResponse, ClientError, ServerError }

export default function alagarr(
  handler: AlagarrHandler = noopHandler,
  options: InterfaceAlagarrOptions = DEFAULT_OPTIONS
): Alagarr {
  return async function handlerWrapper(event, context, callback): Promise<void> {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

    const request = parseRequest(event, context, mergedOptions)
    const response = makeResponse(request, callback, mergedOptions)

    const { requestId } = request.requestContext

    try {
      return handler(request, response)
    } catch (error) {
      // @todo use response.accordingly() instead?

      if (error.name === 'ClientError') {
        return response.json({ error, requestId }, 400)
      }

      return response.json({ error: 'Internal server error occurred', requestId }, 500)
    }
  }
}
