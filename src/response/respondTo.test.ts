// tslint:disable:no-expression-statement
import { EnumDefaultRespondToFormat } from '../types'
import makeResponse from './'

const testRespondToFormats = {
  default: EnumDefaultRespondToFormat.json,
  html: '<html />',
  json: { foo: 'bar' },
}
const testStatusCode = 123

it('respondTo picks correct format based on request Accept header', async () => {
  const htmlResponse = await makeResponse(
    {
      headers: {
        accept: 'text/html,application/json',
      },
    } as any,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('text/html')
      expect(typeof body).toBe('string')
      expect(body).toBe(testRespondToFormats.html)
    },
    {},
  )

  htmlResponse.respondTo(testRespondToFormats, testStatusCode)

  const jsonResponse = await makeResponse(
    {
      headers: {
        accept: 'application/json,text/html',
      },
    } as any,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('application/json')
      expect(typeof body).toBe('string')
      expect(body).toBe(JSON.stringify(testRespondToFormats.json))
    },
    {},
  )

  jsonResponse.respondTo(testRespondToFormats, testStatusCode)
})

it('respondTo allows setting custom headers via options', async () => {
  const testCustomOptions = {
    headers: {
      foo: 'bar-1234',
    },
  }

  const response = await makeResponse(
    {
      headers: {
        accept: 'foo/bar,bar/foo',
      },
    } as any,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('application/json')
      expect(headers.foo).toBe(testCustomOptions.headers.foo)
      expect(typeof body).toBe('string')
      expect(body).toBe(JSON.stringify(testRespondToFormats.json))
    },
    {},
  )

  response.respondTo(testRespondToFormats, testStatusCode, testCustomOptions)
})

it('respondTo correctly falls back on a default format', async () => {
  const response = await makeResponse(
    {
      headers: {
        accept: 'foo/bar,bar/foo',
      },
    } as any,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('application/json')
      expect(typeof body).toBe('string')
      expect(body).toBe(JSON.stringify(testRespondToFormats.json))
    },
    {},
  )

  response.respondTo(testRespondToFormats, testStatusCode)
})
