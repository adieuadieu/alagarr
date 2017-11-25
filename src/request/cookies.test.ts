// tslint:disable:no-expression-statement
import cookie from './cookies'

const testRequest = {
  foo: 'bar',
  headers: {
    cookie: 'PHPSESSID=e61d68c319d12269c6af8cd939298857; REMEMBERME=yah; locale=de_DE',
  },
}

describe('Request cookies', () => {
  test('get parsed', () => {
    const expected = {
      ...testRequest,
      cookies: {
        PHPSESSID: 'e61d68c319d12269c6af8cd939298857',
        REMEMBERME: 'yah',
        locale: 'de_DE',
      },
    }

    const request = cookie(testRequest)

    expect(request).toEqual(expected)
  })
})
