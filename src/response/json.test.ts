// tslint:disable:no-expression-statement
import makeResponse from './'
import json from './json'

const testRequest = { headers: {} } as any
const testJsonBody = { foo: 'bar' }
const testStatusCode = 123

it('Content-Type is JSON', async () => {
  const response = await makeResponse(
    testRequest,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('application/json')
      expect(typeof body).toBe('string')
      expect(body).toBe(JSON.stringify(testJsonBody))
    },
    {},
  )

  response.json(testJsonBody, testStatusCode)
})

it('should not stringify when body is already stringified JSON', async () => {
  expect(json({} as any, {} as any, 'foobar').body).toEqual('"foobar"')
  expect(json({} as any, {} as any, JSON.stringify(testJsonBody)).body).toEqual(
    JSON.stringify(testJsonBody),
  )
  expect(json({} as any, {} as any, `    ${JSON.stringify(testJsonBody)}\n`).body).toEqual(
    JSON.stringify(testJsonBody),
  )
})
