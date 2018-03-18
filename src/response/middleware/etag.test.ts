// tslint:disable:no-expression-statement
import etag, { EMPTY_ENTITY_TAG } from './etag'

const testTextBody = 'foobar'
const testTextBodyETag = '"6-iEPX+SQWIR3p67lj/0zigSWTKHg"'

describe('Response ETag header', () => {
  test('is set correctly given a string', () => {
    const { headers } = etag({
      body: testTextBody,
      headers: {},
      statusCode: 200,
    })

    expect(headers.etag).toBe(testTextBodyETag)
  })

  test('is set correctly given a Buffer', () => {
    const { headers } = etag({
      body: Buffer.from(testTextBody) as any,
      headers: {},
      statusCode: 200,
    })

    expect(headers.etag).toBe(testTextBodyETag)
  })

  test('should handle an empty entity', () => {
    const { headers } = etag({
      body: '',
      headers: {},
      statusCode: 200,
    })

    expect(headers.etag).toBe(EMPTY_ENTITY_TAG)
  })
})
