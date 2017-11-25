// Decodes the request body if it's been base64 encoded by API Gateway
export const decodeBase64Body = (request) => {
  if (request.isBase64Encoded && request.body) {
    const bodyBuffer = Buffer.from(request.body, 'base64')

    return {
      ...request,
      body: bodyBuffer.toString('utf8'),
    }
  }

  return request
}
