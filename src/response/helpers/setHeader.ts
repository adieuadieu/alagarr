import { InterfaceResponse, InterfaceResponseData } from '../../types'

export default function setHeader(
  response: InterfaceResponse,
  responseData: InterfaceResponseData,
  key: string,
  value: string,
): InterfaceResponse {
  // tslint:disable-next-line no-expression-statement
  Object.assign(responseData.headers, { [key]: value })

  return response
}
