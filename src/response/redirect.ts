import { InterfaceResponseData, InterfaceResponseOptions, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const redirect: ResponseHelper = (
  _,
  location,
  statusCode = 302,
  options: InterfaceResponseOptions = {},
): InterfaceResponseData =>
  makeResponseObject('', statusCode, {
    ...options,
    headers: {
      ...options.headers,
      location,
    },
  })

export default redirect
