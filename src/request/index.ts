import applyMiddleware from '../utils/applyMiddleware'
import timestamp from './timestamp'
import normalize from './normalize'
import decodeBase64 from './decode-base64'
import cookies from './cookies'
import json from './json'
import hostname from './hostname'

/*
parse a Lambda APIG event into a request object by
running the request event through list of middleware
*/
export default (event, context) =>
  applyMiddleware([timestamp, normalize, decodeBase64, cookies, json, hostname], {
    ...event,
    context,
  })
