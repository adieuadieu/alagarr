import { RequestMiddleware, ResponseMiddleware } from '../types'

export default (
  middlewareList: ReadonlyArray<RequestMiddleware> | ReadonlyArray<ResponseMiddleware> = [],
  initialData,
  ...args
) => middlewareList.reduce((applied, middleware) => middleware(applied, ...args), initialData)
