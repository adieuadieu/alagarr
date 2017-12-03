import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
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
  contentType?: string
) => ({
  body,
  headers: {
    'content-type': contentType,
    ...headers,
  },
  statusCode,
  ...options,
})

const text = (body: string, statusCode: number, options: object): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/plain')

const html = (body: string, statusCode: number, options: object): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/html')

const json = (body: any, statusCode: number, options: object): InterfaceResponseData =>
  makeResponseObject(JSON.stringify(body), statusCode, options, 'application/json')

const redirect = (location: string, statusCode: number = 302): InterfaceResponseData =>
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
  options: InterfaceAlagarrOptions
): InterfaceResponse =>
  [text, html, json, redirect].reduce(
    (methods, method) => ({
      ...methods,
      [method.name]: (...args) =>
        callback(
          null,
          applyMiddleware(
            [...Object.keys(middlewareMap), ...options.responseMiddleware, log].reduce(
              (middlewareList, middleware) =>
                options[middleware]
                  ? [...middlewareList, middlewareMap[middleware]]
                  : middlewareList
            ),
            method(...args),
            request
          )
        ),
    }),
    {}
  )
