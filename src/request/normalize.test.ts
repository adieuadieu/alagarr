// tslint:disable:no-expression-statement
import normalize from './normalize'

const testRequest = {
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
