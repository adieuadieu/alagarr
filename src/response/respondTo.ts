import {
  InterfaceRequest,
  InterfaceRespondToFormat,
  InterfaceResponseData,
  InterfaceResponseOptions,
} from '../types'
import html from './html'
import json from './json'
import text from './text'

const responseHelpers: { readonly [key: string]: any } = {
  html,
  json,
  text,
}

const respondTo = (
  request: InterfaceRequest,
  format: InterfaceRespondToFormat,
  statusCode?: number,
  options?: InterfaceResponseOptions,
): InterfaceResponseData => {
  const { headers: { accept } } = request
  const fallback = format.default || 'html'

  if (accept && typeof accept === 'string') {
    const acceptFormats = accept
      .split(';')[0]
      .split(',')
      .map(type => {
        const mimeParts = type.split('/')
        return mimeParts[mimeParts.length - 1]
      })

    const bestMatch = acceptFormats.find(type => !!format[type])

    if (bestMatch && bestMatch.length) {
      return responseHelpers[bestMatch](
        request,
        format[bestMatch],
        statusCode,
        options,
      )
    }
  }

  return responseHelpers[fallback](
    request,
    format[fallback],
    statusCode,
    options,
  )
}

export default respondTo
