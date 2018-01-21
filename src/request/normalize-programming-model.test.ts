// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import normalize from './normalize-programming-model'

const testRequest = {
  ...getRequestFixture,
  httpMethod: 'GET',
  queryStringParameters: {
    foo: 'bar',
  },
}

describe('Normalize programming model', () => {
  test('normalize request http method', () => {
    const normalized = normalize({ httpMethod: testRequest.httpMethod } as any)

    expect(normalized.method).toEqual(testRequest.httpMethod)
  })

  test('normalize request query parameters', () => {
    const normalized = normalize({
      queryStringParameters: testRequest.queryStringParameters,
    } as any)

    expect(normalized.query).toEqual(testRequest.queryStringParameters)
  })

  test('handle crap request', () => {
    const normalized = normalize({} as any)

    expect(normalized.query).toEqual(null)
    expect(normalized.method).toEqual('')
  })
})
