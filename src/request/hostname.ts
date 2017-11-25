// Sets the hostname on the request object
export const setHostname = request => ({
  ...request,
  hostname: request.headers.host,
})
