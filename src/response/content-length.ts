export const contentLengthHeader = ({ body, headers, ...rest }) => ({
  ...rest,
  body,
  headers: {
    ...headers,
    'content-length': headers['content-length'] ? headers['content-length'] : body.length,
  },
})
