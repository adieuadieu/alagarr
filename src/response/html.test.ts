// tslint:disable:no-expression-statement
import makeResponse from './'

const testRequest = { headers: {} } as any
const testHtmlBody = '<html></html>'
const testOptions = {
  headers: { 'x-foo-bar': 'foobar', 'Content-Type': 'vnd.foobar/foobar' },
}
const testStatusCode = 123

it('can override headers', async () => {
  const response = await makeResponse(
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

it('Content-Type is HTML', async () => {
  const response = await makeResponse(
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
