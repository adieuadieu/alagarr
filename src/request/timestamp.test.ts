// tslint:disable:no-expression-statement
import timestamp from './timestamp'

const testRequest = {
  headers: {},
}
const testDate = Date.now()

describe('Timestamp', () => {
  test('is applied', () => {
    const request = timestamp(testRequest)

    expect(request.timestamp).toBeGreaterThanOrEqual(testDate)
  })
})
