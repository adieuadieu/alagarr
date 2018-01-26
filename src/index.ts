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
  error: any,
) => {
  const { requestId } = request.requestContext

  // throw any https://github.com/jshttp/http-errors

  if (
    error.name === 'ClientError' ||
    (error.statusCode >= 400 && error.statusCode < 500)
  ) {
    return response.respondTo(
      {
        html: `<html><body>${
          error.message
        }<br/>Request ID: ${requestId}</body></html>`,
        json: { error: error.name, message: error.message, requestId },
      },
      error.statusCode || 400,
    )
  }

  return response.respondTo(
    {
      html: `<html><body>An internal server error occurred.<br/>Request ID: ${requestId}</body></html>`,
      json: {
        error: 'Internal server error',
        message: 'An internal server error occurred',
        requestId,
      },
    },
    500,
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

export {
  Alagarr,
  AlagarrHandler,
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponse,
  ClientError,
  ServerError,
}

export default function alagarr(
  handler: AlagarrHandler = noopHandler,
  options: InterfaceAlagarrOptions = DEFAULT_OPTIONS,
): Alagarr {
  return async function handlerWrapper(
    event,
    context,
    callback,
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

      try {
        return errorHandler(request, response, error)
      } catch (error) {
        // There was an error.. in the error handler. ErrorInception.
        // tslint:disable-next-line:no-console no-expression-statement
        console.error(
          'There was an error in the error handler provided to Alagaar',
          error,
          errorHandler.toString(),
        )

        return defaultErrorHandler(request, response, new ServerError())
      }
    }
  }
}
