import zlib from 'zlib'
import makeResponse, { makeResponseObject } from './response'

const testRequest = { headers: {} }
const testTextBody = [...Array(1000).keys()].join('')
const testHtmlBody = '<html></html>'
const testJsonBody = { foo: 'bar' }
const testOptions = {
  headers: { 'x-foo-bar': 'foobar', 'Content-Type': 'vnd.foobar/foobar' },
}

it('default statusCode is 200', () => {
  const response = makeResponseObject()

  expect(response.statusCode).toBe(200)
})

it('can correctly set parameters', () => {
  const { body, statusCode, headers, ...options } = makeResponseObject(
    'foobar',
    123,
    {
      headers: { foofoo: 'barbar' },
      foo: 'bar',
    }
  )

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

  const response = makeResponse(
    testRequest,
    (error, { statusCode, headers }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(301)
      expect(headers.location).toBe(redirectLocation)
    }
  )

  response.redirect(redirectLocation, 301)
})

it('CSP headers set correctly', () => {
  const response = makeResponse(testRequest, (error, { headers }) => {
    expect(error).toBeNull()
    expect(headers['referrer-policy']).toBeTruthy()
    expect(headers['x-content-type-options']).toBeTruthy()
    expect(headers['x-xss-protection']).toBeTruthy()
    expect(headers['content-security-policy']).toBeTruthy()
    expect(headers['x-frame-options']).toBeTruthy()
  })

  response.html('')
})

it('enforced headers are set correctly', () => {
  const response = makeResponse(testRequest, (error, { headers }) => {
    expect(error).toBeNull()
    expect(headers['strict-transport-security']).toBeTruthy()
  })

  response.html('')
})

it('Response body is not gzipped when <= 256 bytes', () => {
  const response = makeResponse(
    {
      headers: {
        'accept-encoding': 'deflate, gzip, br',
      },
    },
    (error, { body, headers, isBase64Encoded }) => {
      expect(error).toBeNull()
      expect(isBase64Encoded).toBeUndefined()

      expect(headers['content-type']).toBe('text/plain')

      expect(headers['content-encoding']).toBeUndefined()

      expect(typeof body).toBe('string')
      expect(body).toBe(testTextBody.substr(0, 256))
    }
  )

  response.text(testTextBody.substr(0, 256))
})

it('Response body is gzipped when > 256 bytes', () => {
  const response = makeResponse(
    {
      headers: {
        'accept-encoding': 'deflate, gzip, br',
      },
    },
    (error, { body, headers, isBase64Encoded }) => {
      const uncompressedBody = zlib
        .gunzipSync(Buffer.from(body, 'base64'))
        .toString()

      expect(error).toBeNull()
      expect(isBase64Encoded).toBe(
        true,
        'API Gateway requires isBase64Encoded to be true on binary responses'
      )

      expect(headers['content-type']).toBe('text/plain')

      // despite 'deflate' being first in accept-encoding list, we prefer gzip.
      expect(headers['content-encoding']).toBe('gzip')

      expect(typeof body).toBe('string')
      expect(uncompressedBody).toBe(testTextBody)
    }
  )

  response.text(testTextBody)
})
