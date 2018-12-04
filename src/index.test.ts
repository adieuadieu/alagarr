// tslint:disable:no-expression-statement
import {
  get as getRequestFixture,
  mockContext,
} from '../test/fixtures/requests'
import ClientError from './errors/client-error'
import alagarr from './index'

const testRequest = {
  ...getRequestFixture,
  headers: {},
}

function handlerPromise(
  handler: any,
  event = testRequest,
  context = mockContext,
): Promise<any> {
  return new Promise((resolve, reject) =>
    handler(event, context, (error: any, result: any) =>
      error ? reject(error) : resolve(result),
    ),
  )
}

describe('Alagarr NPM Package', () => {
  test('should have zero non-development dependencies', () => {
    const packageJson = require('../package.json')

    expect(Object.keys(packageJson.dependencies).length).toBe(0)
  })
})

describe('Alagarr', () => {
  test('throws error if handler is not provided', async () => {
    const handler = alagarr()
    const result = await handlerPromise(handler)
    expect(result.statusCode).toBe(500)
  })
  test('can respond with JSON', async () => {
    const handler = alagarr(
      (_, response) => response.json({ foo: 'bar' }, 201),
      {},
    )

    const result = await handlerPromise(handler)

    expect(typeof result.body).toBe('string')
    expect(result.body).toBe('{"foo":"bar"}')
    expect(result.statusCode).toBe(201)
    expect(result.headers['content-type']).toBe('application/json')
  })

  test('can catch internal error', async () => {
    const handler = alagarr(() => {
      throw new Error('error here')
    }, {})

    const result = await handlerPromise(handler)

    expect(typeof result.body).toBe('string')
    expect(result.body).toBe(
      '<html><body>An internal server error occurred.<br/>Request ID: foobar</body></html>',
    )
    expect(result.statusCode).toBe(500)
    expect(result.headers['content-type']).toBe('text/html')
  })

  test('can catch an error with errorHandler', async () => {
    const error = new Error('error here')
    const errorHandler = jest.fn((_, response) => response.text('caught'))
    const handler = alagarr(
      () => {
        throw error
      },
      {
        errorHandler,
      },
    )

    const result = await handlerPromise(handler)

    expect(result.body).toBe('caught')
  })

  test('can catch an error thrown in errorHandler', async () => {
    const error = new Error('error here')
    const errorHandler = jest.fn(() => {
      throw error
    })
    const handler = alagarr(
      () => {
        throw error
      },
      {
        errorHandler,
      },
    )

    const result = await handlerPromise(handler)

    expect(typeof result.body).toBe('string')
    expect(result.body).toBe(
      '<html><body>An internal server error occurred.<br/>Request ID: foobar</body></html>',
    )
    expect(result.statusCode).toBe(500)
    expect(result.headers['content-type']).toBe('text/html')
  })

  test('can catch ClientError error', async () => {
    const handler = alagarr(() => {
      throw new ClientError('error here')
    }, {})

    const result = await handlerPromise(handler)

    expect(typeof result.body).toBe('string')
    expect(result.body).toBe(
      '<html><body><strong>Client Error 400</strong>: error here<br/>Request ID: foobar</body></html>',
    )
    expect(result.statusCode).toBe(400)
    expect(result.headers['content-type']).toBe('text/html')
  })
})
