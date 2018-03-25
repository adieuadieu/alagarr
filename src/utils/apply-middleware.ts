// aka.... compose.. or rather, pipe?
export type Middleware<T> = (...args: any[]) => T // tslint:disable-line readonly-array

export default async function applyMiddleware<T>(
  middlewareList: ReadonlyArray<Middleware<T>>,
  initialData: T,
  ...args: any[] // tslint:disable-line readonly-array
): Promise<T> {
  return middlewareList.reduce(
    async (applied: Promise<T>, middleware: Middleware<T>) =>
      middleware(await applied, ...args),
    Promise.resolve(initialData),
  )
}
