// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../../test/fixtures/requests'
import log, { logger } from './log'

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
    const spy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementationOnce(item => expect(item).toContain('statusCode'))

    const result = log(mockResponse, mockRequest, mockOptions)

    expect(result.statusCode).toBe(200)
    expect(spy).toHaveBeenCalledTimes(1)
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

describe('Default logger', () => {
  test('should construct a requestUri when request contained query string parameters', () => {
    jest.spyOn(process.stdout, 'write').mockImplementationOnce((_: any) => true)
    expect(logger(mockRequest, mockResponse).requestUri).toBe('/')

    jest.spyOn(process.stdout, 'write').mockImplementationOnce((_: any) => true)
    expect(
      logger(
        { ...mockRequest, queryStringParameters: { foo: 'bar', bar: 'foo' } },
        mockResponse,
      ).requestUri,
    ).toBe('/?foo=bar&bar=foo')
  })

  test('should write to process.stdout when statusCode is not in the 500s', () => {
    jest
      .spyOn(process.stdout, 'write')
      .mockImplementationOnce(item => !expect(item).toContain('statusCode'))

    const result = logger(mockRequest, mockResponse)

    expect(result.statusCode).toBe(200)
  })

  test('should write to process.stderr when statusCode is in the 500s', () => {
    const spy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementationOnce(item => !expect(item).toContain('statusCode'))

    const result = logger(mockRequest, { ...mockResponse, statusCode: 500 })

    expect(result.statusCode).toBe(500)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('should include httpProtocol', () => {
    jest.spyOn(process.stdout, 'write').mockImplementationOnce((_: any) => true)

    const result = logger(
      {
        ...mockRequest,
        headers: { ...mockRequest.headers, via: 'foo bar' },
      },
      mockResponse,
    )

    expect(result.httpProtocol).toBe('foo')
  })

  test('should include request content-length', () => {
    jest.spyOn(process.stdout, 'write').mockImplementationOnce((_: any) => true)

    expect(
      logger(
        {
          ...mockRequest,
          body: 'foobar',
        },
        mockResponse,
      ).requestContentLength,
    ).toBe(6)

    jest.spyOn(process.stdout, 'write').mockImplementationOnce((_: any) => true)

    expect(
      logger(
        {
          ...mockRequest,
          body: undefined,
        },
        mockResponse,
      ).requestContentLength,
    ).toBe(0)
  })
})
