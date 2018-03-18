// tslint:disable:no-expression-statement
import * as zlib from 'zlib'
import { get as getRequestFixture } from '../test/fixtures/requests'
import compress from './compress'

const testTextBody = [...Array(1000).keys()].join('')
const mockRequest = {
  ...getRequestFixture,
  headers: {
    'accept-encoding': 'deflate, gzip, br',
  },
}

describe('Compress response middleware', () => {
  test('should not compress response body when content-type is not compressible', () => {
    const { body, headers, isBase64Encoded } = compress(
      {
        body: testTextBody.substr(0, 256),
        headers: {
          'content-type': 'image/jpeg',
        },
        statusCode: 200,
      },
      mockRequest,
    )

    expect(isBase64Encoded).toBeUndefined()

    expect(headers['content-type']).toBe('image/jpeg')
    expect(headers['content-encoding']).toBeUndefined()

    expect(typeof body).toBe('string')
    expect(body).toBe(testTextBody.substr(0, 256))
  })

  test('should not gzip response body when body is <= 256 bytes', () => {
    const { body, headers, isBase64Encoded } = compress(
      {
        body: testTextBody.substr(0, 256),
        headers: {
          'content-type': 'text/plain',
        },
        statusCode: 200,
      },
      mockRequest,
    )

    expect(isBase64Encoded).toBeUndefined()

    expect(headers['content-type']).toBe('text/plain')
    expect(headers['content-encoding']).toBeUndefined()

    expect(typeof body).toBe('string')
    expect(body).toBe(testTextBody.substr(0, 256))
  })

  test('should gzip response body when body is > 256 bytes', () => {
    const { body, headers, isBase64Encoded } = compress(
      {
        body: testTextBody,
        headers: {
          'content-type': 'text/plain',
        },
        statusCode: 200,
      },
      mockRequest,
    )
    const uncompressedBody = zlib
      .gunzipSync(Buffer.from(body, 'base64'))
      .toString()

    // API Gateway requires isBase64Encoded to be true on binary responses
    expect(isBase64Encoded).toBe(true)

    expect(headers['content-type']).toBe('text/plain')

    // despite 'deflate' being first in accept-encoding list, we prefer gzip.
    expect(headers['content-encoding']).toBe('gzip')

    expect(typeof body).toBe('string')
    expect(uncompressedBody).toBe(testTextBody)
  })

  test('should use deflate when "gzip" not in Accepts-Encoding header', () => {
    const { body, headers, isBase64Encoded } = compress(
      {
        body: testTextBody,
        headers: {
          'content-type': 'text/plain',
        },
        statusCode: 200,
      },
      {
        ...mockRequest,
        headers: { 'accept-encoding': 'deflate, br' },
      },
    )

    const uncompressedBody = zlib
      .inflateSync(Buffer.from(body, 'base64'))
      .toString()

    // API Gateway requires isBase64Encoded to be true on binary responses
    expect(isBase64Encoded).toBe(true)

    expect(headers['content-type']).toBe('text/plain')

    // despite 'deflate' being first in accept-encoding list, we prefer gzip.
    expect(headers['content-encoding']).toBe('deflate')

    expect(typeof body).toBe('string')
    expect(uncompressedBody).toBe(testTextBody)
  })
})
