export type Alagarr = (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context,
  callback: AWSLambda.Callback
) => void

export type AlagarrHandler = (request: any, response: any) => void

export type Logger = (request: any, response: any) => boolean

export interface InterfaceAlagarrOptions {
  readonly cspPolicies?: any // lazy
  readonly enableCompression?: boolean
  readonly enableContentLength?: boolean
  readonly enableCspHeaders?: boolean
  readonly enableLogger?: boolean
  readonly enableEnforcedHeaders?: boolean
  readonly logger?: Logger
  readonly headers?: object
  readonly requestMiddleware?: any // lazy
  readonly responseMiddleware?: any // lazy
}

export interface InterfaceRequest extends AWSLambda.APIGatewayEvent {
  // readonly body: string | object
  readonly cookies?: object
  readonly headers: any // lazy
  readonly hostname?: string
  readonly isBase64Encoded: boolean
  readonly timestamp?: number
  readonly context: AWSLambda.Context
}

export type RequestMiddleware = (request: InterfaceRequest) => InterfaceRequest
/*export interface RequestMiddleware {
  (request: InterfaceRequest): InterfaceRequest
}*/

export interface InterfaceResponseData {
  readonly body: string
  readonly headers: any // lazy
  readonly isBase64Encoded?: boolean
  readonly statusCode: number
}

export interface InterfaceResponse {
  readonly redirect: (location: string, statusCode?: number) => void
  readonly text: (text: string, statusCode?: number) => void
  readonly html: (html: string, statusCode?: number) => void
  readonly json: (json: any, statusCode?: number) => void
}

export interface ResponseMiddleware {
  (response: InterfaceResponse, request: InterfaceRequest): InterfaceResponse
}
