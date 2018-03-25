// tslint:disable:no-expression-statement
import applyMiddleware from './apply-middleware'

it('middleware is applied correctly', async () => {
  const initialData = { foo: 'bar', sum: 0 }

  const testMiddleware = (
    object: any,
    one: number,
    two: number,
    three: number,
  ) => ({
    ...object,
    one,
    two,
    three, // tslint:disable-line object-literal-sort-keys
    sum: object.sum + one + two + three,
  })

  const result = await applyMiddleware(
    [testMiddleware, testMiddleware, testMiddleware],
    initialData,
    1,
    2,
    3,
  )
  expect(result.sum).toBe(18)
  expect(result.foo).toBe('bar')
})
