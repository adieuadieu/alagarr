// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import hostname from './hostname'

const testEvent = {
  ...getRequestFixture,
  foo: 'bar',
  headers: {
    host: 'foobar.foo.bar',
  },
}

describe('Request hostname', () => {
  test('is set', () => {
    const expected = {
      ...testEvent,
      hostname: 'foobar.foo.bar',
    }

    const request = hostname(testEvent)

    expect(request).toEqual(expected)
  })
})
