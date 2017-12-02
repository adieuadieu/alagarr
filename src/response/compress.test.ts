it('Response body is not gzipped when <= 256 bytes', () => {
  const response = makeResponse(
    {
      headers: {
        'accept-encoding': 'deflate, gzip, br',
      },
    },
    (error, { body, headers, isBase64Encoded }) => {
      expect(error).toBeNull()
      expect(isBase64Encoded).toBeUndefined()

      expect(headers['content-type']).toBe('text/plain')

      expect(headers['content-encoding']).toBeUndefined()

      expect(typeof body).toBe('string')
      expect(body).toBe(testTextBody.substr(0, 256))
    }
  )

  response.text(testTextBody.substr(0, 256))
})

it('Response body is gzipped when > 256 bytes', () => {
  const response = makeResponse(
    {
      headers: {
        'accept-encoding': 'deflate, gzip, br',
      },
    },
    (error, { body, headers, isBase64Encoded }) => {
      const uncompressedBody = zlib.gunzipSync(Buffer.from(body, 'base64')).toString()

      expect(error).toBeNull()
      expect(isBase64Encoded).toBe(
        true,
        'API Gateway requires isBase64Encoded to be true on binary responses'
      )

      expect(headers['content-type']).toBe('text/plain')

      // despite 'deflate' being first in accept-encoding list, we prefer gzip.
      expect(headers['content-encoding']).toBe('gzip')

      expect(typeof body).toBe('string')
      expect(uncompressedBody).toBe(testTextBody)
    }
  )

  response.text(testTextBody)
})
