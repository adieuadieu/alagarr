import * as querystring from 'querystring'
import { InterfaceRequest, InterfaceResponseData } from '../types'

const meta = { coldStart: true }

export default function logger(
  request: InterfaceRequest,
  response: InterfaceResponseData,
): boolean {
  const {
    headers: requestHeaders = {},
    requestContext = { identity: {} },
    context,
  } = request
  const error = response.statusCode >= 500 && response.statusCode < 600

  const logEntry = {
    dateTime: new Date().toISOString(),

    // AWS stuff
    awsAccountId: requestContext.accountId,
    deploymentStage: requestContext.stage,

    // Lambda stuff
    coldStart: meta.coldStart,
    requestTime: request.timestamp ? Date.now() - request.timestamp : undefined,

    lambda: {
      functionName: context.functionName,
      memoryLimit: Number(context.memoryLimitInMB),
      remainingExecutionTime:
        context.getRemainingTimeInMillis && context.getRemainingTimeInMillis(),
      requestId: context.awsRequestId,
    },

    // API Gateway stuff
    apig: {
      requestId: requestContext.requestId,
      resourcePath: requestContext.resourcePath,
    },

    xForwardedHost: requestHeaders['x-forwarded-host'],

    hostname: request.hostname,
    httpMethod: requestContext.httpMethod,
    httpProtocol: requestHeaders.via && requestHeaders.via.split(' ')[0],
    httpReferrer: requestHeaders.referer,
    httpUserAgent: requestHeaders['user-agent'],

    requestContentLength: (request.body && request.body.length) || 0,
    requestUri:
      request.path +
      (request.queryStringParameters
        ? `?${querystring.stringify(request.queryStringParameters)}`
        : ''),
    responseContentLength: response.headers['content-length'],
    sourceIp: requestContext.identity.sourceIp,
    statusCode: response.statusCode,

    // cloudfront
    cf: {
      country: requestHeaders['cloudfront-viewer-country'],
      desktop: requestHeaders['cloudfront-is-desktop-viewer'] === 'true',
      mobile: requestHeaders['cloudfront-is-mobile-viewer'] === 'true',
      smarttv: requestHeaders['cloudfront-is-smarttv-viewer'] === 'true',
      tablet: requestHeaders['cloudfront-is-tablet-viewer'] === 'true',
    },
  }

  if (meta.coldStart) {
    // tslint:disable-next-line: no-expression-statement no-object-mutation
    meta.coldStart = false
  }

  return (error ? process.stderr : process.stdout).write(
    JSON.stringify(logEntry),
  )
}
