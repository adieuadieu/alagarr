import { InterfaceRequest, InterfaceResponse } from './types'

export default function defaultErrorHandler(
  request: InterfaceRequest,
  response: InterfaceResponse,
  error: any,
): void {
  const { requestId } = request.requestContext

  // throw any https://github.com/jshttp/http-errors

  const errorName =
    error.name && typeof error.name === 'string'
      ? error.name.replace(
          /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g,
          '$1$4 $2$3$5',
        )
      : 'Error'
  const errorMessage = error.message || ''
  const statusCode = error.statusCode ? ` ${error.statusCode}` : ''

  return error.name === 'ClientError' ||
    (error.statusCode >= 400 && error.statusCode < 500)
    ? response.respondTo(
        {
          html: `<html><body><strong>${errorName}${statusCode}</strong>: ${errorMessage}<br/>Request ID: ${requestId}</body></html>`,
          json: { error: error.name, message: errorMessage, requestId },
        },
        error.statusCode || 400,
      )
    : response.respondTo(
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
