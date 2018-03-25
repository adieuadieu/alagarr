// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../../test/fixtures/requests'
import parseUrlEncodedBody from './url-encoded-body'

const testRequest = {
  ...getRequestFixture,
  body: 'foo=bar&bar=foo',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
}

describe('Request urlEncoded body', () => {
  test('body is parsed if content-type application/x-www-form-urlencoded', () => {
    const expected = {
      ...testRequest,
      body: {
        bar: 'foo',
        foo: 'bar',
      },
    }

    const result = parseUrlEncodedBody(testRequest)
    expect(typeof result.body).not.toBe('string')
    expect(result).toEqual(expected)
  })

  test('body is not parsed if content-type is not application/x-www-form-urlencoded', () => {
    const invalidTestRequest = {
      ...testRequest,
      headers: { 'content-type': 'foo/bar' },
    }

    const result = parseUrlEncodedBody(invalidTestRequest)
    expect(typeof result.body).toBe('string')
    expect(result).toEqual(invalidTestRequest)
  })

  test('correctly handle shitty body', () => {
    const expected = {
      ...testRequest,
      body: -1,
    }

    const result = parseUrlEncodedBody({
      ...testRequest,
      body: -1,
    })

    expect(result).toEqual(expected)
  })
})
