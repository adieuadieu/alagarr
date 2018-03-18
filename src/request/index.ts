import * as AWSLambda from 'aws-lambda' // tslint:disable-line:no-implicit-dependencies
import { InterfaceAlagarrOptions, InterfaceRequest } from '../types'
import applyMiddleware from '../utils/apply-middleware'
import cookies from './middleware/cookies'
import decode from './middleware/decode'
import hostname from './middleware/hostname'
import jsonBody from './middleware/json-body'
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
