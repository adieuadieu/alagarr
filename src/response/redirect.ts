import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const redirect: ResponseHelper = (
  _,
  location,
  statusCode = 302,
): InterfaceResponseData =>
  makeResponseObject('', statusCode, {
    headers: {
      location,
    },
  })

export default redirect
