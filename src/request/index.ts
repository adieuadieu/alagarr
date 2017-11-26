import { InterfaceRequest } from '../types'
import applyMiddleware from '../utils/applyMiddleware'
import cookies from './cookies'
import decode from './decode'
import hostname from './hostname'
import json from './json'
import normalize from './normalize'
import timestamp from './timestamp'

/*
parse a Lambda APIG event into a request object by
running the request event through list of middleware
*/
export default (event, context, options = {}): InterfaceRequest =>
  applyMiddleware(
    [timestamp, normalize, decode, cookies, json, hostname],
    {
      ...event,
      context,
    },
    options
  )
