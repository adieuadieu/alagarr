// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import log from './log'

const mockRequest = {
  ...getRequestFixture,
}

const mockOptions = {
  headers: {
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  },
}

describe('Request/Response logging ', () => {
  test('is logged by default logger when none is provided in options', () => {
    const response = log(
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

  })

  test('is logged by options.logger if one is provided', () => {
    const response = log(
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

  })
})
