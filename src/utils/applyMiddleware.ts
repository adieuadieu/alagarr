import {
  InterfaceRequest,
  InterfaceResponse,
  RequestMiddleware,
  ResponseMiddleware,
} from '../types'

// aka.... compose.. or rather, pipe?

export default async function applyMiddleware<T>(
  middlewareList: ReadonlyArray<RequestMiddleware | ResponseMiddleware>,
  initialData: any,
  ...args: any[] //ReadonlyArray<TT>[]
): Promise<T> {
  return middlewareList.reduce(
    async (applied: T, middleware: any) => middleware(await applied, ...args),
    initialData,
  )
}
