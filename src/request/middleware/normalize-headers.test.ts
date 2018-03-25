// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../../test/fixtures/requests'
import normalize from './normalize-headers'

const testRequest = {
  ...getRequestFixture,
  body: 'foobar',
  headers: { 'X-Foo-Bar': 'foobar' },
}

describe('Normalize request headers', () => {
  test('headers to lower-case', () => {
    const expected = { ...testRequest, headers: { 'x-foo-bar': 'foobar' } }
    const normalized = normalize(testRequest)

    expect(normalized).toEqual(expected)
  })

  test('headers can be empty', () => {
    const expected = { ...testRequest, headers: {} }
    const normalized = (normalize as any)({
      ...testRequest,
      headers: undefined,
    })

    expect(normalized).toEqual(expected)
  })
})
