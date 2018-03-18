import * as AWSLambda from 'aws-lambda' // tslint:disable-line:no-implicit-dependencies
import { InterfaceAlagarrOptions, InterfaceRequest } from '../types'
import applyMiddleware from '../utils/apply-middleware'
import cookies from './cookies'
import decode from './decode'
import hostname from './hostname'
import jsonBody from './json-body'
import normalizeHeaders from './normalize-headers'
import normalizeProgrammingModel from './normalize-programming-model'
import timestamp from './timestamp'
import urlEncodedBody from './url-encoded-body'

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
      decode,
      cookies,
      urlEncodedBody,
      jsonBody,
      hostname,
      ...(options.requestMiddleware || []),
    ],
    Object.freeze({
      ...event,
      context,
    }) as InterfaceRequest,
    options,
  )
