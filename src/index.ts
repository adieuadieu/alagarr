import defaultErrorHandler from './error-handler'
import ClientError from './errors/client-error'
import ServerError from './errors/server-error'
import makeRequest from './request'
import makeResponse from './response'
import {
  Alagarr,
  HandlerFunction,
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponse,
} from './types'

const DEFAULT_OPTIONS: InterfaceAlagarrOptions = {
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

const noopHandler = (_: void, _1: InterfaceResponse) => {
  throw new ServerError(
    'Misconfiguration in Alagarr setup. No handler function was provided.',
  )
}

export {
  Alagarr,
  HandlerFunction,
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponse,
  ClientError,
  ServerError,
}

export default function alagarr(
  handler: HandlerFunction = noopHandler,
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

    const request = await makeRequest(event, context, mergedOptions)
    const response = await makeResponse(request, callback, mergedOptions)

    try {
      // @TODO: given truthy result:
      // request.source is http-event-ish?
      // --> result is string, starts with html? response.html()
      // --> result is string? response.text()
      // --> result is object? response.json()
      // response.raw()

      return await handler(request, response, context)
    } catch (error) {
      const errorHandler =
        typeof mergedOptions.errorHandler === 'function'
          ? mergedOptions.errorHandler
          : defaultErrorHandler

      try {
        return await errorHandler(request, response, error)
      } catch (error) {
        // There was an error.. in the error handler. ErrorInception.

        // tslint:disable-next-line:no-console no-expression-statement
        console.error(
          'There was an error in the error handler provided to Alagaar',
          error,
          errorHandler.toString(),
        )

        return defaultErrorHandler(request, response, error)
      }
    }
  }
}
