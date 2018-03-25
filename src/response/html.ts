import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const html: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(body, statusCode, options, 'text/html')

export default html
