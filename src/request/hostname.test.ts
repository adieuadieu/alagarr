// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../test/fixtures/requests'
import hostname from './hostname'

const testEvent = {
  ...getRequestFixture,
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

    expect(request.hostname).toBe(expected.hostname)

    expect(request).toEqual(expected)
  })

  test('is undefined if Host header is unset', () => {
    const expected = {
      ...testEvent,
      headers: undefined,
      hostname: undefined,
    }

    const request = hostname({ ...testEvent, headers: undefined })

    expect(request).toEqual(expected)
  })
})
