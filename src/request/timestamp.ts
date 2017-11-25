// Adds a timestamp for use in calculating ellapsed duration
export const addTimestamp = request => ({
  ...request,
  timestamp: Date.now(),
})
