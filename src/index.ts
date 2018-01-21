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

const defaultErrorHandler = (
  request: InterfaceRequest,
  response: InterfaceResponse,
  error: any
) => {
  const { requestId } = request.requestContext

  // @todo use response.basedOnAccepts() instead?

  // throw any https://github.com/jshttp/http-errors

  if (
    error.name === 'ClientError' ||
    (error.statusCode >= 400 && error.statusCode < 500)
  ) {
    return response.json({ error, requestId }, error.statusCode || 400)
  }

  return response.json(
    { error: 'Internal server error occurred', requestId },
    500
  )
}

const DEFAULT_OPTIONS = {
  cspPolicies: [],
  enableCompression: true,
  enableContentLength: true,
  enableCspHeaders: true,
  enableETagHeader: true,
  enableEnforcedHeaders: true,
  enableLogger: true,
  enableStrictTransportSecurity: true,
  errorHandler: defaultErrorHandler,
  requestMiddleware: [],
  responseMiddleware: [],
}

const noopHandler = (_: void, response: InterfaceResponse) =>
  response.json({
    error:
      'Misconfiguration in Alagarr setup. Failed to provide a handler function.',
  })

export { InterfaceRequest, InterfaceResponse, ClientError, ServerError }

export default function alagarr(
  handler: AlagarrHandler = noopHandler,
  options: InterfaceAlagarrOptions = DEFAULT_OPTIONS
): Alagarr {
  return async function handlerWrapper(
    event,
    context,
    callback
  ): Promise<void> {
    const mergedOptions: InterfaceAlagarrOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
    const request = parseRequest(event, context, mergedOptions)
    const response = makeResponse(request, callback, mergedOptions)

    try {
      return await handler(request, response, context)
    } catch (error) {
      const errorHandler =
        typeof mergedOptions.errorHandler === 'function'
          ? mergedOptions.errorHandler
          : defaultErrorHandler

      // If there's an error in the error handler, you're on your own.
      return errorHandler(request, response, error)
    }
  }
}
