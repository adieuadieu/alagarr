import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const redirect: ResponseHelper = (
  _,
  location,
  statusCode = 302,
  options,
): InterfaceResponseData =>
  makeResponseObject('', statusCode, {
    headers: {
      ...options,
      location,
    },
  })

export default redirect
