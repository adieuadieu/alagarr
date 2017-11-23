import applyMiddleware from './applyMiddleware'

it('middleware is applied correctly', () => {
  const initialData = { foo: 'bar', sum: 0 }

  const testMiddleware = (object, one, two, three) => ({
    ...object, one, two, three, sum: object.sum + one + two + three,
  })

  const result = applyMiddleware(
    [testMiddleware, testMiddleware, testMiddleware],
    initialData,
    1,
    2,
    3
  )
  expect(result.sum).toBe(18)
  expect(result.foo).toBe('bar')
})
