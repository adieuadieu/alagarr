// Lowercases all header names
export const normalizeHeaders = ({ headers = {}, ...request }) => ({
  ...request,
  headers: Object.keys(headers).reduce(
    (normalizedHeaders, key) => ({
      ...normalizedHeaders,
      [key.toLowerCase()]: headers[key],
    }),
    {}
  ),
})
