// tslint:disable:no-expression-statement
import alagarr from './index'
import { get as getRequestFixture, mockContext } from './test/fixtures/requests'

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
    handler(
      event,
      context,
      (error: any, result: any) => (error ? reject(error) : resolve(result)),
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
  test('can respond with JSON', async () => {
    const handler = alagarr((_, response) => {
      response.json({ foo: 'bar' }, 201)
    }, {})

    const result = await handlerPromise(handler)

    expect(typeof result.body).toBe('string')
    expect(result.body).toBe('{"foo":"bar"}')
    expect(result.statusCode).toBe(201)
    expect(result.headers['content-type']).toBe('application/json')
  })

  // @TODO
  test('@TODO try-catch error response, errorhandle works', async () => {
    expect('@TODO').toBe('done')
  })
})
