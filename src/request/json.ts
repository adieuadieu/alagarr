// Parses JSON request body, if there is one
export const parseJsonBody = (request) => {
  const { headers } = request
  let { body } = request

  if (headers['content-type'] === 'application/json' && typeof body === 'string' && body.length) {
    try {
      body = JSON.parse(body)
    } catch (error) {
      console.warn('Unable to parse request json-body.', body)
      body = {}
    }
  }

  return { ...request, body }
}
