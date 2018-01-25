export type Alagarr = (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context,
  callback: AWSLambda.Callback,
) => void

export type AlagarrHandler = (
  request: any,
  response: any,
  context?: AWSLambda.Context,
) => void

export type Logger = (request: any, response: any) => boolean

export type ErrorHandler = (
  request: InterfaceRequest,
  response: InterfaceResponse,
  error: any,
) => void

export interface InterfaceAlagarrOptions {
  readonly cspPolicies?: any // lazy
  readonly enableCompression?: boolean
  readonly enableContentLength?: boolean
  readonly enableCspHeaders?: boolean
  readonly enableLogger?: boolean
  readonly enableEnforcedHeaders?: boolean
  readonly enableETagHeader?: boolean
  readonly enableStrictTransportSecurity?: boolean
  readonly errorHandler?: ErrorHandler
  readonly logger?: Logger
  readonly headers?: object
  readonly requestMiddleware?: any // lazy
  readonly responseMiddleware?: any // lazy
}

export interface InterfaceRequest extends AWSLambda.APIGatewayEvent {
  readonly body: any
  readonly cookies?: object
  readonly headers: { readonly [name: string]: string }
  readonly hostname?: string | undefined
  readonly isBase64Encoded: boolean
  readonly timestamp?: number
  readonly context: AWSLambda.Context
  readonly method?: string
  readonly query?: { readonly [name: string]: string }
  readonly source?: string
}

export type RequestMiddleware = (request: InterfaceRequest) => InterfaceRequest
/*export interface RequestMiddleware {
  (request: InterfaceRequest): InterfaceRequest
}*/

export interface InterfaceRespondToFormat {
  readonly default?: string
  readonly html?: string
  readonly json?: any

  readonly [key: string]: any
}

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
  readonly respondTo: (format: any, statusCode?: number) => void
}

export interface InterfaceResponseMiddleware {
  (response: InterfaceResponse, request: InterfaceRequest): InterfaceResponse
}
