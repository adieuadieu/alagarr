// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../test/fixtures/requests'
import log from './log'

const mockRequest = {
  ...getRequestFixture,
}

const mockResponse = {
  body: 'foobar',
  headers: {
    foo: 'bar',
  },
  statusCode: 200,
}

const mockOptions = {
  enableLogger: true,
}

describe('Request/Response logging ', () => {
  test('is logged by default logger when none is provided in options', () => {
    const mockLogger = jest.fn()

    jest.doMock('../../utils/logger', () => ({ default: mockLogger }))
    jest.resetModules()

    const response = require('./log').default(
      mockResponse,
      mockRequest,
      mockOptions,
    )

    expect(mockLogger).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
  })

  test('is logged by custom options.logger if one is provided', () => {
    const mockCustomLogger = jest.fn(() => true)

    const response = log(mockResponse, mockRequest, {
      ...mockOptions,
      logger: mockCustomLogger,
    })

    expect(mockCustomLogger).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
  })

  test('will always return response regardles of the logger result', () => {
    const mockCustomLogger = jest.fn(() => false)

    const response = log(mockResponse, mockRequest, {
      ...mockOptions,
      logger: mockCustomLogger,
    })

    expect(mockCustomLogger).toHaveBeenCalledTimes(1)
    expect(response).toBe(response)
  })

  test('should not log when enableLogger is falsy', () => {
    const mockCustomLogger = jest.fn(() => false)

    const response = log(mockResponse, mockRequest, {
      enableLogger: false,
      logger: mockCustomLogger,
    })

    expect(mockCustomLogger).toHaveBeenCalledTimes(0)
    expect(response).toBe(response)
  })
})
