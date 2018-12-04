import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const html: ResponseHelper = (
  responseData: InterfaceResponseData,
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(responseData, body, statusCode, options, 'text/html')

export default html
