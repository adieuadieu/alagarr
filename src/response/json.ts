import { InterfaceResponseData, ResponseHelper } from '../types'
import makeResponseObject from './make-response-object'

const json: ResponseHelper = (
  _,
  body,
  statusCode,
  options,
): InterfaceResponseData =>
  makeResponseObject(
    JSON.stringify(body),
    statusCode,
    options,
    'application/json',
  )

export default json
