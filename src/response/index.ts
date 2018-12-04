import {
  InterfaceAlagarrOptions,
  InterfaceRequest,
  InterfaceResponse,
  InterfaceResponseData,
} from '../types'
import applyMiddleware from '../utils/apply-middleware'
import makeResponseObject from './make-response-object'
import compress from './middleware/compress'
import contentLength from './middleware/content-length'
import csp from './middleware/csp'
import enforcedHeaders from './middleware/enforced-headers'
import etag from './middleware/etag'
import log from './middleware/log'

import html from './html'
import json from './json'
import redirect from './redirect'
import respondTo from './respondTo'
import text from './text'

import setHeader from './helpers/setHeader'

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
): Promise<InterfaceResponse> => {
  const responseData = makeResponseObject()

  const responseWithHelpers: InterfaceResponse = [
    text,
    html,
    json,
    redirect,
    respondTo,
  ].reduce(
    (
      methods: InterfaceResponse,
      // tslint:disable-next-line readonly-array
      method: (...args: any[]) => InterfaceResponseData,
    ) => ({
      ...methods,
      [method.name]: async (
        ...args: any[] // tslint:disable-line readonly-array
      ) =>
        callback(
          null,
          await applyMiddleware(
            [...Object.keys(middlewareMap)].reduce(
              (middlewareList, middleware) =>
                (options as any)[middleware]
                  ? [...middlewareList, (middlewareMap as any)[middleware]]
                  : middlewareList,
              [
                ...(options.responseMiddleware || []),
                ...(options.enableLogger ? [log] : []), // needs to come last
              ],
            ),
            method(responseData, request, ...args),
            request,
            options,
          ),
        ),
    }),
    { raw: callback } as any,
  )

  const response = [setHeader]
  .reduce(
    // tslint:disable-next-line readonly-array
      (responseMethods, method: (...args: any[]) => any) => ({
        ...responseMethods,
        // tslint:disable-next-line readonly-array
        [method.name]: (...args: any[]) =>
          method(response, responseData, ...args),
      }),
      responseWithHelpers,
    )

  return response
}
