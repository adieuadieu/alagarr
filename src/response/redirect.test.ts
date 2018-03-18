// tslint:disable:no-expression-statement
import makeResponse from './'

const testRequest = { headers: {} } as any

it('Redirect status code correct with Location header', async () => {
  const redirectLocation = 'test://foobar.com'

  const response = await makeResponse(
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
