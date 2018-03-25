import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const text: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/plain')

export default text
