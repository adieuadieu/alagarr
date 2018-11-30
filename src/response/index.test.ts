// tslint:disable:no-expression-statement
import makeResponse from './'

const testRequest = { headers: {} } as any

it('can access underlying callback method directly', async () => {
  const testResult = { foo: 'bar' }
  const response = await makeResponse(
    testRequest,
    (error, result) => {
      expect(error).toBeInstanceOf(Error)
      expect(result).toEqual(testResult)
    },
    {},
  )

  response.raw(new Error('foobar'), testResult)
})

it('can set headers using setHeader method in a chained way', async () => {
  const callback = jest.fn()

  const response = await makeResponse(testRequest, callback, {})

  response.setHeader('test-header', 'test-value').setHeader('foo', 'bar')

  await response.text('any')

  expect(callback).toBeCalledWith(
    null,
    expect.objectContaining({
      headers: expect.objectContaining({
        foo: 'bar',
        'test-header': 'test-value',
      }),
    }),
  )
})
