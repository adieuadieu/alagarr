import * as crypto from 'crypto'
import { InterfaceResponseData } from '../../types'

// based on: https://github.com/jshttp/etag/blob/master/index.js
// without support for fs.Stats
export const EMPTY_ENTITY_TAG = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'

function entitytag(entity: string | Buffer): string {
  // compute hash of the entity
  const hash = crypto
    .createHash('sha1')
    .update(entity, 'utf8')
    .digest('base64')
    .substring(0, 27)

  // compute length of the entity
  const length =
    typeof entity === 'string'
      ? Buffer.byteLength(entity, 'utf8')
      : entity.length

  return `"${length.toString(16)}-${hash}"`
}

function etag(entity: string | Buffer): string {
  return entity.length === 0 ? EMPTY_ENTITY_TAG : entitytag(entity)
}

// Apply ETag Header
export default function etagHeader(
  response: InterfaceResponseData,
): InterfaceResponseData {
  return {
    ...response,
    headers: {
      ...response.headers,
      etag: etag(response.body),
    },
  }
}
