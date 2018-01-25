// tslint:disable:no-expression-statement
import makeResponse, { makeResponseObject } from './'

const testRequest = { headers: {} } as any
const testHtmlBody = '<html></html>'
const testJsonBody = { foo: 'bar' }
const testOptions = {
  headers: { 'x-foo-bar': 'foobar', 'Content-Type': 'vnd.foobar/foobar' },
}

const testRespondToFormats = {
  default: 'json',
  html: '<html />',
  json: { foo: 'bar' },
}
const testStatusCode = 123

// @TODO add a test to check for middleware length if some middleware is not enabled in config

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
      foo: 'bar',
    },
  )

  expect(body).toBe('foobar')
  expect(statusCode).toBe(testStatusCode)
  expect(headers.foofoo).toBe('barbar')
  expect(options.foo).toBe('bar')
})

it('can override headers', () => {
  const response = makeResponse(
    testRequest,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['x-foo-bar']).toBe(testOptions.headers['x-foo-bar'])
      expect(headers['Content-Type']).toBe(testOptions.headers['Content-Type'])
      expect(body).toBe(testHtmlBody)
    },
    {},
  )

  response.html(testHtmlBody, testStatusCode, testOptions)
})

it('Content-Type is HTML', () => {
  const response = makeResponse(
    testRequest,
    (error, { body, statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('text/html')
      expect(typeof body).toBe('string')
      expect(body).toBe(testHtmlBody)
    },
    {},
  )

  response.html(testHtmlBody, testStatusCode)
})

it('Content-Type is JSON', () => {
  const response = makeResponse(
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

it('Redirect status code correct with Location header', () => {
  const redirectLocation = 'test://foobar.com'

  const response = makeResponse(
    testRequest,
    (error, { statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(301)
      expect(headers.location).toBe(redirectLocation)
    },
    {},
  )

  response.redirect(redirectLocation, 301)
})

it('respondTo picks correct format based on request Accept header', () => {
  const htmlResponse = makeResponse(
    {
      headers: {
        accept: 'text/html,application/json',
      },
    } as any,
    (error, { body, statusCode, headers }) => {
      console.log(body, statusCode, headers)

      expect(error).toBeNull()
      expect(statusCode).toBe(testStatusCode)
      expect(headers['content-type']).toBe('text/html')
      expect(typeof body).toBe('string')
      expect(body).toBe(testRespondToFormats.html)
    },
    {},
  )

  htmlResponse.respondTo(testRespondToFormats, testStatusCode)

  const jsonResponse = makeResponse(
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

it('respondTo correctly falls back on a default format', () => {
  const response = makeResponse(
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
