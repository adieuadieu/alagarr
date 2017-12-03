// tslint:disable:no-expression-statement
import etag from './etag'

const testTextBody = 'foobar'
const testTextBodyETag = '"6-iEPX+SQWIR3p67lj/0zigSWTKHg"'

describe('Response ETag header', () => {
  test('is set correctly', () => {
    const { headers } = etag({
      body: testTextBody,
      headers: {},
      statusCode: 200,
    })

    expect(headers.etag).toBe(testTextBodyETag)
  })
})
