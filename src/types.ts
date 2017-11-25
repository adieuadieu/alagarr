export type Alagarr = (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.APIGatewayEventRequestContext,
  callback: AWSLambda.Callback
) => void

export type AlagarrHandler = (request: any, response: any) => void

export interface InterfaceAlagarrOptions {
  readonly cspPolicies?: any
  readonly requestMiddleware?: any
  readonly responseMiddleware?: any
}

export interface InterfaceRequest {
  readonly body?: string | object
  readonly cookies?: object
  readonly headers: any // lazy
  readonly hostname?: string
  readonly isBase64Encoded?: boolean
  readonly timestamp?: number
}

export type RequestMiddleware = (request: InterfaceRequest) => InterfaceRequest

export interface InterfaceResponse {
  readonly path: string
}

export type ResponseMiddleware = (request: InterfaceResponse) => InterfaceResponse
