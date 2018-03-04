import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceRespondToFormat,
  InterfaceResponse,
  InterfaceResponseData,
  ResponseHelper,
} from '../types'
import applyMiddleware from '../utils/applyMiddleware'
import compress from './compress'
import contentLength from './content-length'
import csp from './csp'
import enforcedHeaders from './enforced-headers'
import etag from './etag'
import log from './log'

export const makeResponseObject = (
  body: string,
  statusCode: number = 200,
  { headers = {}, ...options } = {},
  contentType?: string,
) =>
  Object.freeze({
    body,
    headers: {
      'content-type': contentType,
      ...headers,
    },
    statusCode,
    ...options,
  })

const text: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/plain')

const html: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/html')

const json: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(
    JSON.stringify(body),
    statusCode,
    options,
    'application/json',
  )

const responseHelpers: { readonly [key: string]: any } = {
  html,
  json,
  text,
}

const respondTo: ResponseHelper = (
  request,
  format: InterfaceRespondToFormat,
  statusCode: number,
): InterfaceResponseData => {
  const { headers: { accept } } = request
  const fallback = format.default || 'html'

  if (accept && typeof accept === 'string') {
    const acceptFormats = accept
      .split(';')[0]
      .split(',')
      .map(type => {
        const mimeParts = type.split('/')
        return mimeParts[mimeParts.length - 1]
      })

    const bestMatch = acceptFormats.find(type => !!format[type])

    if (bestMatch && bestMatch.length) {
      return responseHelpers[bestMatch](request, format[bestMatch], statusCode)
    }
  }

  return responseHelpers[fallback](request, format[fallback], statusCode)
}

const redirect: ResponseHelper = (
  _,
  location,
  statusCode = 302,
): InterfaceResponseData =>
  makeResponseObject('', statusCode, {
    headers: {
      location,
    },
  })

const middlewareMap = {
  enableCompression: compress,
  enableContentLength: contentLength,
  enableCspHeaders: csp,
  enableETagHeader: etag,
  enableEnforcedHeaders: enforcedHeaders,
}

export default async (
  request: InterfaceRequest,
  callback: AWSLambda.Callback,
  options: InterfaceAlagarrOptions,
): Promise<InterfaceResponse> =>
  [text, html, json, respondTo, redirect].reduce(
    (methods, method) => ({
      ...methods,
      [method.name]: async (...args) =>
        callback(
          null,
          await applyMiddleware(
            [...Object.keys(middlewareMap)].reduce(
              (middlewareList, middleware) =>
                options[middleware]
                  ? [...middlewareList, middlewareMap[middleware]]
                  : middlewareList,
              [
                ...(options.responseMiddleware || []),
                ...(options.enableLogger ? [log] : []), // needs to come last
              ],
            ),
            method(request, ...args),
            request,
            options,
          ),
        ),
    }),
    {
      raw(
        error?: Error | null,
        result?: object | boolean | number | string,
      ): void {
        // @TODO apply middleware? logger?
        return callback(error, result)
      },
    },
  )
