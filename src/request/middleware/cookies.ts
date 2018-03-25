import { InterfaceRequest } from '../../types'

export interface InterfaceCookie {
  readonly [key: string]: string
}

// based on: github.com/jshttp/cookie/blob/20e762cb32be80c6a2b127de68249d441dcf5535/index.js#L49-L83
function parseCookiePair(pair: string): InterfaceCookie {
  const indexOfEqualCharacter = pair.indexOf('=')

  // skip things that don't look like key=value
  const looksLikeKeyValue = indexOfEqualCharacter >= 0

  const key = looksLikeKeyValue && pair.substr(0, indexOfEqualCharacter).trim()
  const value =
    looksLikeKeyValue &&
    pair.substr(indexOfEqualCharacter + 1, pair.length).trim()

  // handle quoted values
  const cleanValue = value && '"' === value[0] ? value.slice(1, -1) : value

  return key ? { [key]: cleanValue ? decodeURIComponent(cleanValue) : '' } : {}
}

function parseCookieHeader(cookieHeader: string): InterfaceCookie {
  const pairs = cookieHeader.split(/; */)

  return pairs.reduce(
    (parsedCookies, pair) => ({ ...parsedCookies, ...parseCookiePair(pair) }),
    {},
  )
}

// Parses cookies out of cookie header
export default function cookies(request: InterfaceRequest): InterfaceRequest {
  return {
    ...request,
    cookies: parseCookieHeader(
      (request.headers && request.headers.cookie) || '',
    ),
  }
}
