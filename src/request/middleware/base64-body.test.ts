// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../../test/fixtures/requests'
import decode from './base64-body'

const testBody = 'foobar test body'
const testBodyBuffer = Buffer.from(testBody, 'utf8')

describe('Decode request', () => {
  test('Base64 encoded body correctly when isBase64Encoded is true', () => {
    const testRequest = {
      ...getRequestFixture,
      body: testBodyBuffer.toString('base64'),
      isBase64Encoded: true,
    }

    const { body } = decode(testRequest)

    expect(body).toBe(testBody)
  })

  test("doesn't modify the request if isBase64Encoded is false", () => {
    const testRequest = {
      ...getRequestFixture,
      body: testBodyBuffer.toString('base64'),
      isBase64Encoded: false,
    }

    const request = decode(testRequest)

    expect(request).toBe(testRequest)
  })

  test("doesn't modify the request if the request body is not a Base64 string", () => {
    const testRequest = {
      ...getRequestFixture,
      body: '',
      isBase64Encoded: false,
    }

    const request = decode(testRequest)

    expect(request).toBe(testRequest)
  })
})
