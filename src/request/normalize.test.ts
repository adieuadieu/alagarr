// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import normalize from './normalize'

const testRequest = {
  ...getRequestFixture,
  foo: 'bar',
  headers: { 'X-Foo-Bar': 'foobar' },
}

describe('Normalize request', () => {
  test('headers to lower-case', () => {
    const expected = { foo: 'bar', headers: { 'x-foo-bar': 'foobar' } }
    const normalized = normalize(testRequest)

    expect(normalized).toEqual(expected)
  })
})
