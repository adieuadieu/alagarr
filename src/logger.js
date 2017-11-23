import querystring from 'querystring'
import { format, inspect } from 'util'
// @TODO import { name, version } from '../package.json'

export default function loggerUtil (
  {
    headers: requestHeaders = {},
    requestContext = { identity: {} },
    context = { getRemainingTimeInMillis: () => undefined },
    ...request
  } = {},
  response = { headers: {} }
) {
  return ['info', 'log', 'warn', 'error'].reduce(
    (logger, level) => ({
      ...logger,
      [level]: (...args) => {
        const logEntry = {
          date_time: new Date().toISOString(),
          // app_name: name,
          // app_version: version,
          log_level: level,

          // AWS stuff
          aws_account_id: requestContext.accountId,
          deployment_stage: requestContext.stage,

          // Lambda stuff
          request_time: Date.now() - request.timestamp,

          lambda: {
            request_id: context.awsRequestId,
            remaining_execution_time:
              context.getRemainingTimeInMillis && context.getRemainingTimeInMillis(),
            memory_limit: Number(context.memoryLimitInMB),
            function_name: context.functionName,
          },

          // API Gateway stuff
          apig: {
            request_id: requestContext.requestId,
            resource_path: requestContext.resourcePath,
          },

          x_forwarded_host: requestHeaders['x-forwarded-host'],

          hostname: request.hostname,
          source_ip: requestContext.identity.sourceIp,
          http_protocol: requestHeaders.via && requestHeaders.via.split(' ')[0],
          http_method: requestContext.httpMethod,
          request_uri:
            requestContext.path +
            (request.queryStringParameters
              ? `?${querystring.stringify(request.queryStringParameters)}`
              : ''),
          status_code: response.statusCode,
          request_content_length: (request.body && request.body.length) || 0,
          response_content_length: response.headers['content-length'],
          http_referrer: requestHeaders.referer,
          http_user_agent: requestHeaders['user-agent'],

          // cloudfront
          cf: {
            desktop: requestHeaders['cloudfront-is-desktop-viewer'] === 'true',
            mobile: requestHeaders['cloudfront-is-mobile-viewer'] === 'true',
            smarttv: requestHeaders['cloudfront-is-smarttv-viewer'] === 'true',
            tablet: requestHeaders['cloudfront-is-tablet-viewer'] === 'true',
            country: requestHeaders['cloudfront-viewer-country'],
          },
        }

        let index = args.length
        while (index--) {
          const err = args[index]
          if (err instanceof Error) {
            logEntry.level = 'error'
            logEntry.type = err.name

            if (request && request.state) {
              logEntry.state = inspect(request.state)
            }

            break
          }
        }

        logEntry.message = format(...args)

        const output = process[['warn', 'error'].includes(level) ? 'stderr' : 'stdout']
        output.write(`${JSON.stringify(logEntry)}\n`)
      },
    }),
    {}
  )
}
