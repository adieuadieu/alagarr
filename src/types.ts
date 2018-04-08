export type Alagarr = (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context,
  callback: AWSLambda.Callback,
) => void

export type HandlerFunction = (
  request: any,
  response: any,
  context?: AWSLambda.Context,
) => string | object | void | Promise<string | object | void>

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

export interface IndexSignature {
  readonly [key: string]: any
}

export interface InterfaceCookie {
  readonly [name: string]: string
}

export interface InterfaceHeaders {
  readonly [name: string]: string
}

export interface InterfaceQueryParameters {
  readonly [name: string]: string
}

export interface InterfaceRequest extends AWSLambda.APIGatewayEvent {
  readonly body: any
  readonly context: AWSLambda.Context
  readonly cookies: InterfaceCookie
  readonly headers: InterfaceHeaders
  readonly hostname?: string
  readonly isBase64Encoded: boolean
  readonly meta: IndexSignature
  readonly method: string
  readonly provider: string
  readonly query: InterfaceQueryParameters
  readonly source: string
  readonly timestamp: number
}

export type RequestMiddleware = (request: InterfaceRequest) => InterfaceRequest

export interface InterfaceResponseData {
  readonly body: string
  readonly headers: any // lazy
  readonly isBase64Encoded?: boolean
  readonly statusCode: number
}

export enum EnumDefaultRespondToFormat {
  html = 'html',
  json = 'json',
}

export interface InterfaceRespondToFormat {
  readonly default?: EnumDefaultRespondToFormat
  readonly html?: string
  readonly json?: any
}

export interface InterfaceResponseOptions {
  readonly headers?: { readonly [header: string]: boolean | number | string }
  readonly isBase64Encoded?: boolean // For binary support via APIGatewayProxyResult
}

export interface InterfaceResponse {
  /**
   * Redirect to a new location.
   */
  readonly redirect: (
    location: string,
    statusCode?: number,
    options?: InterfaceResponseOptions,
  ) => void
  readonly text: (
    text: string,
    statusCode?: number,
    options?: InterfaceResponseOptions,
  ) => void
  readonly html: (
    html: string,
    statusCode?: number,
    options?: InterfaceResponseOptions,
  ) => void
  readonly json: (
    json: any,
    statusCode?: number,
    options?: InterfaceResponseOptions,
  ) => void
  readonly respondTo: (
    formats: InterfaceRespondToFormat,
    statusCode?: number,
    options?: InterfaceResponseOptions,
  ) => void
  readonly raw: (
    error?: Error | null,
    result?: object | boolean | number | string,
  ) => void
}

export type ResponseHelper = (
  request: InterfaceRequest,
  body: any,
  statusCode?: number,
  options?: object,
) => InterfaceResponseData

export type ResponseMiddleware = (
  response: InterfaceResponse,
  request: InterfaceRequest,
) => InterfaceResponse
