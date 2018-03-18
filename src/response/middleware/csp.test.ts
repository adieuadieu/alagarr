// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../test/fixtures/requests'
import cspHeaders from './csp'

const mockRequest = {
  ...getRequestFixture,
}

const mockOptions = {
  cspPolicies: {
    foo: 'bar',
    'frame-ancestors': `'none'`,
  },
}

describe('Response CSP headers', () => {
  test('are set correctly', () => {
    const { headers } = cspHeaders(
      {
        body: 'foobar',
        headers: {
          'content-type': 'text/plain',
        },
        statusCode: 200,
      },
      mockRequest,
      mockOptions,
    )

    expect(headers['referrer-policy']).toBeTruthy()
    expect(headers['x-content-type-options']).toBeTruthy()
    expect(headers['x-xss-protection']).toBeTruthy()
    expect(headers['x-frame-options']).toBeTruthy()

    expect(headers['content-security-policy']).toBeTruthy()
    expect(headers['content-security-policy'].includes('foo bar;')).toBe(true)
  })
})
