// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../test/fixtures/requests'
import parseJsonBody from './json-body'

const testRequest = {
  ...getRequestFixture,
  body: '{"foo": "bar"}',
  headers: {
    'content-type': 'application/json',
  },
}

describe('Request JSON', () => {
  test('body is parsed if content-type application/json', () => {
    const expected = {
      ...testRequest,
      body: {
        foo: 'bar',
      },
    }

    const result = parseJsonBody(testRequest)
    expect(typeof result.body).not.toBe('string')
    expect(result).toEqual(expected)
  })

  test('body is not parsed if content-type is not application/json', () => {
    const nonJsonTestRequest = {
      ...testRequest,
      headers: { 'content-type': 'foo/bar' },
    }

    const result = parseJsonBody(nonJsonTestRequest)
    expect(typeof result.body).toBe('string')
    expect(result).toEqual(nonJsonTestRequest)
  })

  test('correctly handle shitty JSON', () => {
    const expected = {
      ...testRequest,
      body: {},
    }

    const result = parseJsonBody({
      ...testRequest,
      body: '{"huurr hurr:" derp. can\'t parse this on purpose}',
    })

    expect(result).toEqual(expected)
  })
})
