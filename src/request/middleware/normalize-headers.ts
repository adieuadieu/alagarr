import { InterfaceRequest } from '../../types'

// Lowercases all header names
export default function normalizeHeaders({
  headers = {},
  ...request
}: InterfaceRequest): InterfaceRequest {
  return {
    ...request,
    headers: Object.keys(headers).reduce((normalizedHeaders, key) => {
      const normalizedHeaderKey = key.toLowerCase()

      /*
        Lame workaround for https://github.com/dherault/serverless-offline/pull/295
        https://github.com/dherault/serverless-offline/blob/97dc5eab4deb9af673a1b66f3f7a7367f82bf727/src/createLambdaProxyContext.js#L25-L27
        If the request contains header 'content-type', serverless-offline will interpret
        this as "there is no content type header" and adds a "Content-Type" header to
        the simulated aws-gateway request. This then causes problems when we normalize
        the headers as the "Content-Type" header will overwrite "content-type" header
        from the real request when we "Content-Type".toLowerCase()
      */
      return request.provider === 'aws' &&
        Reflect.has(normalizedHeaders, normalizedHeaderKey) &&
        normalizedHeaderKey === 'content-type' &&
        headers[key] === 'application/json'
        ? normalizedHeaders
        : {
            ...normalizedHeaders,
            [normalizedHeaderKey]: headers[key],
          }
    }, {}),
  }
}
