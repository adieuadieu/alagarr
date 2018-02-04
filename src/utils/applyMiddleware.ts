import {
  InterfaceRequest,
  InterfaceResponse,
  RequestMiddleware,
  ResponseMiddleware,
} from '../types'

// aka.... compose.. or rather, pipe?

export default function applyMiddleware<T>(
  middlewareList: ReadonlyArray<RequestMiddleware | ResponseMiddleware>,
  initialData: any,
  ...args: any[] //ReadonlyArray<TT>[]
): T {
  return middlewareList.reduce(
    async (applied: T, middleware: any) => middleware(applied, ...args),
    initialData,
  )
}
