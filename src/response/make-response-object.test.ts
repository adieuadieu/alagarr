// tslint:disable:no-expression-statement
import makeResponseObject from './make-response-object'

const testStatusCode = 123

it('default statusCode is 200', () => {
  const response = makeResponseObject('foobar')

  expect(response.statusCode).toBe(200)
})

it('can correctly set parameters', () => {
  const { body, statusCode, headers, ...options } = makeResponseObject(
    'foobar',
    testStatusCode,
    {
      headers: { foofoo: 'barbar' },
      isBase64Encoded: true,
    } as any,
  )

  expect(body).toBe('foobar')
  expect(statusCode).toBe(testStatusCode)
  expect(headers.foofoo).toBe('barbar')
  expect(options.isBase64Encoded).toBe(true)
})
