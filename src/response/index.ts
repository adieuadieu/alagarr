import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceRespondToFormat,
  InterfaceResponse,
  InterfaceResponseData,
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
) => ({
  body,
  headers: {
    'content-type': contentType,
    ...headers,
  },
  statusCode,
  ...options,
})

const text = (
  body: string,
  statusCode: number,
  options?: object,
): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/plain')

const html = (
  body: string,
  statusCode: number,
  options?: object,
): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/html')

const json = (
  body: any,
  statusCode: number,
  options?: object,
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

const respondTo = (
  format: InterfaceRespondToFormat,
  statusCode: number,
  { headers: { accept } }: InterfaceRequest,
): InterfaceResponseData => {
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
      return responseHelpers[bestMatch](format[bestMatch], statusCode)
    }
  }

  return responseHelpers[fallback](format[fallback], statusCode)
}

const redirect = (
  location: string,
  statusCode: number = 302,
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

export default (
  request: InterfaceRequest,
  callback: AWSLambda.Callback,
  options: InterfaceAlagarrOptions,
): InterfaceResponse =>
  [text, html, json, respondTo, redirect].reduce(
    (methods, method) => ({
      ...methods,
      [method.name]: (...args) =>
        callback(
          null,
          applyMiddleware(
            [...Object.keys(middlewareMap)].reduce(
              (middlewareList, middleware) =>
                options[middleware]
                  ? [...middlewareList, middlewareMap[middleware]]
                  : middlewareList,
              [...(options.responseMiddleware || []), log],
            ),
            method(...args, request),
            request,
            options,
          ),
        ),
    }),
    {},
  )
