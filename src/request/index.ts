import * as AWSLambda from 'aws-lambda' // tslint:disable-line:no-implicit-dependencies
import { InterfaceAlagarrOptions, InterfaceRequest } from '../types'
import applyMiddleware from '../utils/applyMiddleware'
import cookies from './cookies'
import decode from './decode'
import hostname from './hostname'
import jsonBody from './jsonBody'
import normalizeHeaders from './normalize-headers'
import normalizeProgrammingModel from './normalize-programming-model'
import timestamp from './timestamp'
import urlEncodedBody from './urlEncodedBody'

/*
parse a Lambda APIG event into a request object by
running the request event through list of middleware
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
    }),
    options,
  )
