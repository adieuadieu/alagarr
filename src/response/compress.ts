import * as accepts from 'accepts'
import * as compressible from 'compressible'
import * as zlib from 'zlib'
import { InterfaceRequest, InterfaceResponseData } from '../types'

const ZLIB_DEFAULT_OPTIONS = {
  level: 5,
}

function getEncoding(request: InterfaceRequest): string | boolean {
  const accept = accepts(request as any)
  const encoding = accept.encoding(['gzip', 'deflate', 'identity'])

  // prefer gzip over deflate
  if (encoding === 'deflate' && accept.encoding(['gzip'])) {
    return accept.encoding(['gzip', 'identity'])
  }

  return encoding
}

// Gzip/deflate response body when appropriate
export default function compress(
  response: InterfaceResponseData,
  request: InterfaceRequest,
): InterfaceResponseData {
  const { body, headers, ...rest } = response
  const encoding = getEncoding(request)

  // Gzip compression is only required when running in lambda,
  // as in our development/CI setup, this is handled by nginx:
  const weShouldCompress =
    compressible(headers['content-type']) &&
    encoding &&
    encoding !== 'identity' &&
    body &&
    body.length > 256

  if (weShouldCompress) {
    const compressed =
      encoding === 'gzip'
        ? zlib.gzipSync(body, ZLIB_DEFAULT_OPTIONS)
        : zlib.deflateSync(body, ZLIB_DEFAULT_OPTIONS)

    return {
      ...rest,
      body: compressed.toString('base64'),
      headers: {
        ...headers,
        'content-encoding': encoding,
        'content-length': compressed.byteLength,
      },
      isBase64Encoded: true,
    }
  }

  return response
}
