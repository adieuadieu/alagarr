import * as querystring from 'querystring'
import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponseData,
} from '../../types'

function aws(request: InterfaceRequest): object {
  const { headers: requestHeaders, requestContext, context } = request

  return {
    awsAccountId: requestContext.accountId,
    deploymentStage: requestContext.stage,

    // API Gateway stuff
    apig: {
      requestId: requestContext.requestId,
      resourcePath: requestContext.resourcePath,
    },

    // cloudfront
    cloudfront: {
      country: requestHeaders['cloudfront-viewer-country'],
      desktop: requestHeaders['cloudfront-is-desktop-viewer'] === 'true',
      mobile: requestHeaders['cloudfront-is-mobile-viewer'] === 'true',
      smarttv: requestHeaders['cloudfront-is-smarttv-viewer'] === 'true',
      tablet: requestHeaders['cloudfront-is-tablet-viewer'] === 'true',
    },

    lambda: {
      functionName: context.functionName,
      memoryLimit: Number(context.memoryLimitInMB),
      remainingExecutionTime:
        context.getRemainingTimeInMillis && context.getRemainingTimeInMillis(),
      requestId: context.awsRequestId,
    },

    sourceIp: requestContext.identity.sourceIp,
  }
}

export function logger(
  request: InterfaceRequest,
  response: InterfaceResponseData,
): any {
  const {
    source,
    headers: requestHeaders,
    meta,
    requestContext,
    provider,
  } = request
  const error = response.statusCode >= 500 && response.statusCode < 600

  const logEntry = {
    dateTime: new Date().toISOString(),
    eventSource: source,
    hostname: request.hostname,
    httpMethod: requestContext.httpMethod,
    httpProtocol: requestHeaders.via && requestHeaders.via.split(' ')[0],
    httpReferrer: requestHeaders.referer,
    httpUserAgent: requestHeaders['user-agent'],
    requestContentLength: (request.body && request.body.length) || 0,
    requestTime: Date.now() - request.timestamp,
    requestUri:
      request.path +
      (request.query && Object.keys(request.query).length
        ? `?${querystring.stringify(request.query)}`
        : ''),
    responseContentLength: response.headers['content-length'],
    statusCode: response.statusCode,
    xForwardedHost: requestHeaders['x-forwarded-host'],

    ...meta,

    // Provider specific properties
    ...(provider === 'aws' && aws(request)),
  }

  return (
    (error ? process.stderr : process.stdout).write(JSON.stringify(logEntry)) &&
    logEntry
  )
}

// Logs request/response info
export default function logResponse(
  response: InterfaceResponseData,
  request: InterfaceRequest,
  options: InterfaceAlagarrOptions,
): InterfaceResponseData {
  return (
    (options.enableLogger &&
      ((typeof options.logger === 'function'
        ? options.logger(request, response)
        : logger(request, response)) &&
        response)) ||
    response
  )
}
