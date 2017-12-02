import {
  InterfaceRequest,
  InterfaceResponse,
  RequestMiddleware,
  ResponseMiddleware,
} from '../types'

export default function applyMiddleware<T>(
  middlewareList: ReadonlyArray<RequestMiddleware | ResponseMiddleware>,
  initialData: any,
  ...args: any[] //ReadonlyArray<TT>[]
): T {
  return middlewareList.reduce(
    (applied: T, middleware: any) => middleware(applied, ...args),
    initialData
  )
}
