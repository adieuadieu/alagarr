import * as AWSLambda from 'aws-lambda' // tslint:disable-line:no-implicit-dependencies
import { InterfaceAlagarrOptions, InterfaceRequest } from '../types'
import applyMiddleware from '../utils/apply-middleware'
import base64Body from './middleware/base64-body'
import cookies from './middleware/cookies'
import hostname from './middleware/hostname'
import jsonBody from './middleware/json-body'
import meta from './middleware/meta'
import normalizeHeaders from './middleware/normalize-headers'
import normalizeProgrammingModel from './middleware/normalize-programming-model'
import timestamp from './middleware/timestamp'
import urlEncodedBody from './middleware/url-encoded-body'

/*
parse a Serverless Invocation (Lambda) event into a request object by
running the request event object through list of middleware
*/
export default async (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context,
  options: InterfaceAlagarrOptions = {},
): Promise<InterfaceRequest> =>
  // aka pipe()...
  applyMiddleware(
    [
      timestamp,
      normalizeProgrammingModel,
      normalizeHeaders,
      base64Body,
      cookies,
      urlEncodedBody,
      jsonBody,
      hostname,
      meta,
      ...(options.requestMiddleware || []),
    ],
    Object.freeze({
      ...event,
      context,
    }) as InterfaceRequest,
    options,
  )
