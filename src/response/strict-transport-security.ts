// Apply headers we want to always set
export const enforcedHeaders = ({ headers, ...rest }) => ({
  ...rest,
  headers: {
    ...headers,
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  },
})
