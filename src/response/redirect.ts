import {
  InterfaceResponseData,
  InterfaceResponseOptions,
  ResponseHelper,
} from '../types'
import makeResponseObject from './make-response-object'

const redirect: ResponseHelper = (
  responseData: InterfaceResponseData,
  _,
  location,
  statusCode = 302,
  options: InterfaceResponseOptions = {},
): InterfaceResponseData =>
  makeResponseObject(responseData, '', statusCode, {
    ...options,
    headers: {
      ...options.headers,
      location,
    },
  })

export default redirect
