import zlib from 'zlib'
import accepts from 'accepts'
import compressible from 'compressible'

// Gzip/deflate response body when appropriate
export const compress = ({ body, headers, ...rest }, request) => {
  const zlibOptions = {
    level: 5,
  }
  const compressHeaders = {}
  const compressBody = {}
  const accept = accepts(request)
  let encoding = accept.encoding(['gzip', 'deflate', 'identity'])

  // prefer gzip over deflate
  if (encoding === 'deflate' && accept.encoding(['gzip'])) {
    encoding = accept.encoding(['gzip', 'identity'])
  }

  // Gzip compression is only required when running in lambda,
  // as in our development/CI setup, this is handled by nginx:
  const weShouldCompress =
    !request.isOffline &&
    compressible(headers['content-type']) &&
    encoding &&
    encoding !== 'identity' &&
    body &&
    body.length > 256

  if (weShouldCompress) {
    const compressed =
      encoding === 'gzip' ? zlib.gzipSync(body, zlibOptions) : zlib.deflateSync(body, zlibOptions)

    compressBody.body = compressed.toString('base64')
    compressBody.isBase64Encoded = true
    compressHeaders['content-encoding'] = encoding
    compressHeaders['content-length'] = compressed.byteLength
  }

  return {
    ...rest,
    body,
    headers: { ...headers, ...compressHeaders },
    ...compressBody,
  }
}
