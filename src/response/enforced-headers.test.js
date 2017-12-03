// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import enforcedHeaders from './enforced-headers'

const mockRequest = {
  ...getRequestFixture,
}

const mockOptions = {
  headers: {
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  },
}

describe('Response enforced headers', () => {
  test('are set correctly', () => {
    const { headers } = enforcedHeaders(
      {
        body: 'foobar',
        headers: {
          foo: 'bar',
        },
        statusCode: 200,
      },
      mockRequest,
      mockOptions
    )

    expect(headers['strict-transport-security']).toBe(
      mockOptions.headers['strict-transport-security']
    )
    expect(headers.foo).toBe('bar')
  })
})
