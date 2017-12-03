// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import cookie from './cookies'

const testRequest = {
  ...getRequestFixture,
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

  test('header might not exist', () => {
    const expected = {
      ...testRequest,
      cookies: {},
      headers: {},
    }

    const request = cookie({ ...testRequest, headers: {} })

    expect(request).toEqual(expected)
  })
})
