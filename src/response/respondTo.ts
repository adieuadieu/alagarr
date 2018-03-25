import {
  InterfaceRequest,
  InterfaceRespondToFormat,
  InterfaceResponseData,
  InterfaceResponseOptions,
  ResponseHelper,
} from '../types'
import html from './html'
import json from './json'

function getBestMatchedFormat(
  formats: InterfaceRespondToFormat,
  accept: string,
): string {
  const fallback = formats.default || 'html'

  const acceptFormats =
    accept &&
    typeof accept === 'string' &&
    accept
      .split(';')[0]
      .split(',')
      .map(type => {
        const mimeParts = type.split('/')
        return mimeParts[mimeParts.length - 1]
      })

  return (
    (acceptFormats && acceptFormats.find(type => Reflect.has(formats, type))) ||
    fallback
  )
}

function getBestMatchedResponseHelper(format: string): ResponseHelper {
  switch (format) {
    case 'html':
      return html
    case 'json':
      return json
  }

  throw new TypeError(`"${format}" is not a valid Alagarr respondTo() format.`)
}

function getBestMatchedFormatBody(
  formats: InterfaceRespondToFormat,
  format: string,
): any {
  switch (format) {
    case 'html':
      return formats.html
    case 'json':
      return formats.json
  }

  throw new TypeError(`"${format}" is not a valid Alagarr respondTo() format.`)
}

export default function respondTo(
  request: InterfaceRequest,
  formats: InterfaceRespondToFormat,
  statusCode?: number,
  options?: InterfaceResponseOptions,
): InterfaceResponseData {
  const { headers: { accept } } = request

  const format = getBestMatchedFormat(formats, accept)
  const responseHelper = getBestMatchedResponseHelper(format)
  const body = getBestMatchedFormatBody(formats, format)

  return responseHelper(request, body, statusCode, options)
}
