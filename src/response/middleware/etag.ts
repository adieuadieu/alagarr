import * as etag from 'etag'
import { InterfaceResponseData } from '../../types'

// Apply headers we want to always set
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
