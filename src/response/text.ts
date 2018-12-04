import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const text: ResponseHelper = (
  responseData: InterfaceResponseData,
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(responseData, body, statusCode, options, 'text/plain')

export default text
