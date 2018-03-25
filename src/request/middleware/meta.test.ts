// tslint:disable:no-expression-statement
import { get as getRequestFixture } from '../../../test/fixtures/requests'
import meta from './meta'

const testEvent = {
  ...getRequestFixture,
}

describe('Request meta', () => {
  test('is set correctly', () => {
    expect(meta(testEvent).meta).toEqual({
      coldStart: true,
      invocationCount: 1,
    })

    expect(meta(testEvent).meta).toEqual({
      coldStart: false,
      invocationCount: 2,
    })
  })
})
