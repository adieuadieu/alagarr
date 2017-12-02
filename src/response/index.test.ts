import zlib from 'zlib'
import makeResponse, { makeResponseObject } from './response'

const testRequest = { headers: {} }
const testTextBody = [...Array(1000).keys()].join('')
const testHtmlBody = '<html></html>'
const testJsonBody = { foo: 'bar' }
const testOptions = {
  headers: { 'x-foo-bar': 'foobar', 'Content-Type': 'vnd.foobar/foobar' },
}

// @TODO add a test to check for middleware length if some middleware is not enabled in config

it('default statusCode is 200', () => {
  const response = makeResponseObject()

  expect(response.statusCode).toBe(200)
})

it('can correctly set parameters', () => {
  const { body, statusCode, headers, ...options } = makeResponseObject('foobar', 123, {
    headers: { foofoo: 'barbar' },
    foo: 'bar',
  })

  expect(body).toBe('foobar')
  expect(statusCode).toBe(123)
  expect(headers.foofoo).toBe('barbar')
  expect(options.foo).toBe('bar')
})

it('can override headers', () => {
  const response = makeResponse(testRequest, (error, { body, headers }) => {
    expect(error).toBeNull()
    expect(headers['x-foo-bar']).toBe(testOptions.headers['x-foo-bar'])
    expect(headers['Content-Type']).toBe(testOptions.headers['Content-Type'])
    expect(body).toBe(testHtmlBody)
  })

  response.html(testHtmlBody, 200, testOptions)
})

it('Content-Type is HTML', () => {
  const response = makeResponse(testRequest, (error, { body, headers }) => {
    expect(error).toBeNull()
    expect(headers['content-type']).toBe('text/html')
    expect(typeof body).toBe('string')
    expect(body).toBe(testHtmlBody)
  })

  response.html(testHtmlBody)
})

it('Content-Type is JSON', () => {
  const response = makeResponse(testRequest, (error, { body, headers }) => {
    expect(error).toBeNull()
    expect(headers['content-type']).toBe('application/json')
    expect(typeof body).toBe('string')
    expect(body).toBe(JSON.stringify(testJsonBody))
  })

  response.json(testJsonBody)
})

it('Redirect status code correct with Location header', () => {
  const redirectLocation = 'test://foobar.com'

  const response = makeResponse(testRequest, (error, { statusCode, headers }) => {
    expect(error).toBeNull()
    expect(statusCode).toBe(301)
    expect(headers.location).toBe(redirectLocation)
  })

  response.redirect(redirectLocation, 301)
})
