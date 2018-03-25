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
